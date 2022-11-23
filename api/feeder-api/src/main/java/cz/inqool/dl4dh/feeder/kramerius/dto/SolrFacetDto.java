package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

import java.text.Collator;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
public class SolrFacetDto {
    private Map<String, List<Object>> facet_fields;

    private static String keyTransform(String key) {
        if (key.startsWith("nameTag.")) {
            key = key.substring(8);
        }
        switch (key) {
            case "facet_autor": return "authors";
            case "model_path": return "models";
            case "dostupnost": return "availability";
            case "language": return "languages";
            case "collection": return "collections";
            case "keyword": return "keywords";
            case "datum_begin": return "years";
            default: return key;
        }
    }

    public Map<String, Map<String, Object>> transformed() {
        return transformed(new HashMap<>());
    }

    public Map<String, Map<String, Object>> transformed(Map<String, CollectionDto> collections) {
        return facet_fields.entrySet()
                .stream()
                .collect(Collectors.toMap(e -> keyTransform(e.getKey()), e -> {
                    Map<String, Object> map = new TreeMap<>(Collator.getInstance(Locale.forLanguageTag("cs")));
                    for (int i = 0; i < e.getValue().size(); i+=2) {
                        String key = (String)e.getValue().get(i);
                        //For models return only base types
                        if (e.getKey().equals("model_path")) {
                            if (key.contains("/") || key.contains("volume") || key.contains("unit")) {
                                continue;
                            }
                        }
                        //For collection return translations
                        if (e.getKey().equals("collection")) {
                            map.put(key, collections.containsKey(key) ? collections.get(key) : e.getValue().get(i+1));
                            continue;
                        }
                        map.put(key, e.getValue().get(i+1));
                    }
                    return map;
                }));
    }
}
