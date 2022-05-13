package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.AvailabilityEnum;
import cz.inqool.dl4dh.feeder.enums.DocumentModelEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
public class FiltersDto {
    private String query = "*:*";
    private AvailabilityEnum availability = AvailabilityEnum.ALL;
    private Set<DocumentModelEnum> models = new HashSet<>();
    private Set<String> keywords = new HashSet<>();
    private Set<String> authors = new HashSet<>();
    private Set<String> languages = new HashSet<>();
    private Set<String> collections = new HashSet<>();
    private Integer yearFrom;
    private Integer yearTo;

    public String toFqQuery() {
        List<List<String>> list = new ArrayList<>();
        list.add(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit"));

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

        if (yearFrom != null || yearTo != null) {
            List<String> yearList = new ArrayList<>();
            if (yearFrom != null) {
                yearList.add("datum_begin:["+yearFrom+" TO *]");
            }
            if (yearTo != null) {
                yearList.add("datum_begin:[* TO "+yearTo+"]");
            }
            list.add(List.of(String.join(" AND ", yearList)));
        }

        return list.stream().map(v -> "("+String.join(" OR ", v)+")").collect(Collectors.joining(" AND "));
    }
}
