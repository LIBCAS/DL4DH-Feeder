package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.dl4dh.feeder.enums.*;
import cz.inqool.dl4dh.feeder.service.KrameriusSolrFieldsService;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @GeneratedValue(generator = "filter_generator")
    @SequenceGenerator(
            name = "filter_generator",
            sequenceName = "filter_sequence"
    )
    private Long id;

    @JsonIgnore
    private String username;

    @Column(columnDefinition = "text")
    @Schema(example = "macha AND (maj OR (zivot AND dilo))", description = "Advanced SOLR filter")
    private String query = "";

    @Column(columnDefinition = "boolean default false")
    private boolean searchThroughPages = false;

    //K5 filters
    private AvailabilityEnum availability = AvailabilityEnum.ALL;

    @ElementCollection
    private Set<DocumentModelEnum> models = new HashSet<>();

    @ElementCollection
    @ArraySchema(schema = @Schema(example = "angličtina"))
    private Set<String> keywords = new HashSet<>();

    @ElementCollection
    @ArraySchema(schema = @Schema(example = "Aleš, Mikoláš"))
    private Set<String> authors = new HashSet<>();

    @ElementCollection
    @ArraySchema(schema = @Schema(example = "cze"))
    private Set<String> languages = new HashSet<>();

    @ElementCollection
    @ArraySchema(schema = @Schema(example = "vc:0922837d-56af-43e4-980b-a75f26cda253"))
    private Set<String> collections = new HashSet<>();

    @Column(name = "date_from")
    @Schema(example = "1920")
    private Integer from;

    @Column(name = "date_to")
    @Schema(example = "2020")
    private Integer to;

    @Column(columnDefinition = "text")
    private FiltersSortEnum sort = FiltersSortEnum.TITLE_ASC;

    // K+ filters
    @Column(columnDefinition = "text")
    private EnrichmentEnum enrichment = EnrichmentEnum.ALL;
    private AdvancedFilterFieldEnum advancedFilterField = AdvancedFilterFieldEnum.NONE;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy="filter")
    private List<NameTagFilter> nameTagFilters;

    @Schema(example = "1", description = "Filter availableNameTagFilters response values")
    private String nameTagFacet = "";

    @Schema(example = "0", description = "Show facets in the response")
    private Boolean returnFacets  = true;

    // Pagination
    @Schema(accessMode = Schema.AccessMode.WRITE_ONLY)
    private Integer start = 0;
    @Schema(example = "100", accessMode = Schema.AccessMode.WRITE_ONLY)
    private Integer pageSize = 100;

    // User metadata (name and number of found documents during search)
    @Schema(example = "Obohacene publikace")
    private String name = "";
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long numFound = 0L;

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

    public Filter applyEdismaxToUriBuilder(UriBuilder uriBuilder, boolean includeNameTag, KrameriusSolrFieldsService solrFields) {
        if (this.useEdismax()) {
            uriBuilder.queryParam("defType", "edismax")
                    .queryParam("qf", this.getEdismaxFields(includeNameTag, solrFields));
        }
        return this;
    }

    public Filter applyFqQueryToUriBuilder(UriBuilder uriBuilder, List<String> base, boolean includeNameTag, KrameriusSolrFieldsService solrFields, List<String> publicPolicies) {
        if (!this.toFqQuery(base, includeNameTag, solrFields, publicPolicies).isEmpty()) {
            uriBuilder
                    .queryParam("fq", this.toFqQuery(base, includeNameTag, solrFields, publicPolicies));
        }
        return this;
    }

    @JsonIgnore
    public String getEdismaxFields(boolean includeNameTag, KrameriusSolrFieldsService solrFields) {
        if (advancedFilterField == null) {
            return "";
        }
        if (includeNameTag) {
            return advancedFilterField.getSolrFieldWithKField(solrFields);
        }
        return Arrays.stream(advancedFilterField.getSolrFieldWithKField(solrFields).split(" "))
                .filter(f -> !f.startsWith("nameTag."))
                .collect(Collectors.joining(" "));
    }

    public String toQuery(KrameriusSolrFieldsService solrFields) {
        if (useEdismax()) {
            return query;
        }
        return !query.isEmpty() ? "_query_:\"{edismax}\"" : "*:*";
    }

    public String toFqQuery(List<String> base, boolean includeNameTag, KrameriusSolrFieldsService solrFields, List<String> publicPolicies) {
        List<List<String>> list = new ArrayList<>();
        if (base != null && !base.isEmpty()) {
            list.add(base);
        }

        if (availability == AvailabilityEnum.PUBLIC) {
            list.add(publicPolicies.stream().map(p -> solrFields.accessibility()+":"+p)
                    .collect(Collectors.toList()));
        }
        else if (availability == AvailabilityEnum.PRIVATE) {
            list.add(List.of("NOT("+publicPolicies.stream().map(p -> solrFields.accessibility()+":"+p)
                    .collect(Collectors.joining(" OR "))+")"));
        }

        if (!models.isEmpty()) {
            // If the user is searching through pages, we have to filter through model_path to filter parent's model
            // model_path is a string with multiple values with delimiter
            boolean useBaseModel = (base != null && base.contains(solrFields.model()+":page"));
            String modelPrefix = useBaseModel ? solrFields.modelPath() : solrFields.model();
            list.add(models.stream().map(v -> {
                if (v == DocumentModelEnum.MONOGRAPH) {
                    return "("+modelPrefix+":monograph OR "+modelPrefix+":monographunit)";
                }
                return modelPrefix+":" + v.toString().toLowerCase();
            }).map(v -> (useBaseModel ? v+"*" : v)).collect(Collectors.toList()));
        }

        if (!keywords.isEmpty()) {
            list.add(keywords.stream().map(v -> solrFields.keywords()+":\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!authors.isEmpty()) {
            list.add(authors.stream().map(v -> solrFields.author()+":\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!languages.isEmpty()) {
            list.add(languages.stream().map(v -> solrFields.language()+":\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (!collections.isEmpty()) {
            list.add(collections.stream().map(v -> solrFields.collection()+":\""+v.replaceAll("\"","\\\\\"")+"\"")
                    .collect(Collectors.toList()));
        }

        if (from != null || to != null) {
            List<String> yearList = new ArrayList<>();
            if (from != null) {
                yearList.add(solrFields.dateYearFrom()+":["+ from +" TO *]");
            }
            if (to != null) {
                yearList.add(solrFields.dateYearFrom()+":[* TO "+ to +"]");
            }
            list.add(List.of(String.join(" AND ", yearList)));
        }

        if (nameTagFilters != null && includeNameTag) {
            for (NameTagFilter nameTagFilter : nameTagFilters) {
                list.add(List.of(nameTagFilter.toFilter()));
            }
        }

        return list.stream().map(v -> v.size() == 1 ? v.get(0) : "("+String.join(" OR ", v)+")").collect(Collectors.joining(" AND "));
    }

    public Filter pageSize(Integer pageSize) {
        this.pageSize = pageSize;
        return this;
    }

    public Filter returnFacets(Boolean returnFacets) {
        this.returnFacets = returnFacets;
        return this;
    }

    public Filter availability(AvailabilityEnum availability) {
        this.availability = availability;
        return this;
    }
}
