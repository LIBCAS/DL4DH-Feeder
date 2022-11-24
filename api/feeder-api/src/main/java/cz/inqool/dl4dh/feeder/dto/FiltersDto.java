package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
public class FiltersDto {
    //Title
    private String query = "";

    //K5 filters
    private AvailabilityEnum availability = AvailabilityEnum.ALL;
    private Set<DocumentModelEnum> models = new HashSet<>();
    private Set<String> keywords = new HashSet<>();
    private Set<String> authors = new HashSet<>();
    private Set<String> languages = new HashSet<>();
    private Set<String> collections = new HashSet<>();
    private Integer from;
    private Integer to;
    private FiltersSortEnum sort = FiltersSortEnum.TITLE_ASC;

    //K+ filters
    private EnrichmentEnum enrichment = EnrichmentEnum.ALL;
    private AdvancedFilterFieldEnum advancedFilterField = null;
    private List<NameTagFilterDto> nameTagFilters;
    private String nameTagFacet = "";

    //Pagination
    private Integer start = 0;
    private Integer pageSize = 60;

    public Integer getPageSize() {
        return Integer.min(60, Integer.max(1, pageSize));
    }

    public String getQueryEscaped() {
        return query.replaceAll("\"","\\\\\"");
    }

    public boolean useOnlyEnriched() {
        return (nameTagFilters != null && !nameTagFilters.isEmpty()) ||
                (enrichment != null && enrichment.equals(EnrichmentEnum.ENRICHED));
    }

    public boolean useEdismax() {
        return advancedFilterField != null && !query.isEmpty();
    }

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
        list.add(base);

        if (availability != AvailabilityEnum.ALL) {
            list.add(List.of("dostupnost:" + availability.toString().toLowerCase()));
        }

        if (!models.isEmpty()) {
            list.add(models.stream().map(v -> {
                if (v == DocumentModelEnum.MONOGRAPH) {
                    return "fedora.model:monograph OR fedora.model:monographunit";
                }
                return "fedora.model:" + v.toString().toLowerCase();
            }).collect(Collectors.toList()));
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
            for (NameTagFilterDto nameTagFilter : nameTagFilters) {
                list.add(List.of(nameTagFilter.toFilter()));
            }
        }

        return list.stream().map(v -> "("+String.join(" OR ", v)+")").collect(Collectors.joining(" AND "));
    }
}
