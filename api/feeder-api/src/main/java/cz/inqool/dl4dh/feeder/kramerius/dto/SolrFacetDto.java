package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public Map<String, Map<String, Integer>> transformed() {
        return facet_fields.entrySet()
                .stream()
                .collect(Collectors.toMap(e -> keyTransform(e.getKey()), e -> {
                    Map<String, Integer> map = new HashMap<>();
                    for (int i = 0; i < e.getValue().size(); i+=2) {
                        String key = (String)e.getValue().get(i);
                        //For models return only base types
                        if (keyTransform(e.getKey()).equals("models")) {
                            if (key.contains("/") || key.contains("volume") || key.contains("unit")) {
                                continue;
                            }
                        }
                        map.put(key, (Integer)e.getValue().get(i+1));
                    }
                    return map;
                }));
    }
}
