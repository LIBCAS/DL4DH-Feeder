package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.dl4dh.feeder.enums.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.util.UriBuilder;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "filters")
public class Filter extends AuditModel {

    @Id
    @GeneratedValue(generator = "filter_generator")
    @SequenceGenerator(
            name = "filter_generator",
            sequenceName = "filter_sequence"
    )
    private Long id;

    @JsonIgnore
    private String username;

    @Column(columnDefinition = "text")
    private String query = "";

    @Column(columnDefinition = "boolean default false")
    private boolean searchThroughPages = false;

    //K5 filters
    private AvailabilityEnum availability = AvailabilityEnum.ALL;

    @ElementCollection
    private Set<DocumentModelEnum> models = new HashSet<>();

    @ElementCollection
    private Set<String> keywords = new HashSet<>();

    @ElementCollection
    private Set<String> authors = new HashSet<>();

    @ElementCollection
    private Set<String> languages = new HashSet<>();

    @ElementCollection
    private Set<String> collections = new HashSet<>();

    @Column(name = "date_from")
    private Integer from;

    @Column(name = "date_to")
    private Integer to;

    @Column(columnDefinition = "text")
    private FiltersSortEnum sort = FiltersSortEnum.TITLE_ASC;

    //K+ filters
    @Column(columnDefinition = "text")
    private EnrichmentEnum enrichment = EnrichmentEnum.ALL;
    private AdvancedFilterFieldEnum advancedFilterField = AdvancedFilterFieldEnum.NONE;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy="filter")

    private List<NameTagFilter> nameTagFilters;
    private String nameTagFacet = "";

    //Pagination
    private Integer start = 0;
    private Integer pageSize = 100;

    public Integer getPageSize() {
        return Integer.min(100, Integer.max(1, pageSize));
    }

    /**
     * We have to modify sort, if we are looking for pages (because page has title in another field)
     * @return sorting of the filter
     */
    public FiltersSortEnum getSort() {
        if (isSearchThroughPages()) {
            switch (sort) {
                case TITLE_ASC:
                    return FiltersSortEnum.PAGE_TITLE_ASC;
                case LAST_ENRICHED:
                    return FiltersSortEnum.PAGE_LAST_ENRICHED;
            }
        }
        return sort;
    }

    @JsonIgnore
    public String getQueryEscaped() {
        return query.replaceAll("\"","\\\\\"");
    }

    public boolean useOnlyEnriched() {
        return (nameTagFilters != null && !nameTagFilters.isEmpty()) ||
                (enrichment != null && enrichment.equals(EnrichmentEnum.ENRICHED)) ||
                (advancedFilterField != null && advancedFilterField.getSolrField().contains("nameTag.")) ||
                FiltersSortEnum.LAST_ENRICHED.equals(sort);
    }

    public boolean useEdismax() {
        return advancedFilterField != null && !advancedFilterField.equals(AdvancedFilterFieldEnum.NONE) && !query.isEmpty();
    }

    public Filter applyEdismaxToUriBuilder(UriBuilder uriBuilder, boolean includeNameTag) {
        if (this.useEdismax()) {
            uriBuilder.queryParam("defType", "edismax")
                    .queryParam("qf", this.getEdismaxFields(includeNameTag));
        }
        return this;
    }

    public Filter applyFqQueryToUriBuilder(UriBuilder uriBuilder, List<String> base, boolean includeNameTag) {
        if (!this.toFqQuery(base, includeNameTag).isEmpty()) {
            uriBuilder
                    .queryParam("fq", this.toFqQuery(base, includeNameTag));
        }
        return this;
    }

    @JsonIgnore
    public String getEdismaxFields(boolean includeNameTag) {
        if (advancedFilterField == null) {
            return "";
        }
        if (includeNameTag) {
            return advancedFilterField.getSolrField();
        }
        return Arrays.stream(advancedFilterField.getSolrField().split(" "))
                .filter(f -> !f.startsWith("nameTag."))
                .collect(Collectors.joining(" "));
    }

    public String toQuery() {
        if (useEdismax()) {
            return query;
        }
        return !query.isEmpty() ? "dc.title:\""+getQueryEscaped()+"*\"" : "*:*";
    }

    public String toFqQuery(List<String> base, boolean includeNameTag) {
        List<List<String>> list = new ArrayList<>();
        if (base != null && !base.isEmpty()) {
            list.add(base);
        }

        if (availability != AvailabilityEnum.ALL) {
            list.add(List.of("dostupnost:" + availability.toString().toLowerCase()));
        }

        if (!models.isEmpty()) {
            // If the user is searching through pages, we have to filter through model_path to filter parent's model
            // model_path is a string with multiple values with delimiter
            boolean useBaseModel = (base != null && base.contains("fedora.model:page"));
            String modelPrefix = useBaseModel ? "model_path" : "fedora.model";
            list.add(models.stream().map(v -> {
                if (v == DocumentModelEnum.MONOGRAPH) {
                    return modelPrefix+":monograph OR "+modelPrefix+":monographunit";
                }
                return modelPrefix+":" + v.toString().toLowerCase();
            }).map(v -> (useBaseModel ? v+"*" : v)).collect(Collectors.toList()));
        }

        if (!keywords.isEmpty()) {
            list.add(keywords.stream().map(v -> "keywords:\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!authors.isEmpty()) {
            list.add(authors.stream().map(v -> "dc.creator:\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!languages.isEmpty()) {
            list.add(languages.stream().map(v -> "language:\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!collections.isEmpty()) {
            list.add(collections.stream().map(v -> "collection:\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (from != null || to != null) {
            List<String> yearList = new ArrayList<>();
            if (from != null) {
                yearList.add("datum_begin:["+ from +" TO *]");
            }
            if (to != null) {
                yearList.add("datum_begin:[* TO "+ to +"]");
            }
            list.add(List.of(String.join(" AND ", yearList)));
        }

        if (nameTagFilters != null && includeNameTag) {
            for (NameTagFilter nameTagFilter : nameTagFilters) {
                list.add(List.of(nameTagFilter.toFilter()));
            }
        }

        return list.stream().map(v -> "("+String.join(" OR ", v)+")").collect(Collectors.joining(" AND "));
    }
}
