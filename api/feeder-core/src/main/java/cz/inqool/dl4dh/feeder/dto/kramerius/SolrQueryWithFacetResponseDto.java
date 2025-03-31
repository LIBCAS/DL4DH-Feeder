package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class SolrQueryWithFacetResponseDto extends SolrQueryResponseDto {
    @NotNull
    private SolrFacetDto facet_counts;

    private Map<String, SolrGroupDto> grouped;

    public void processGrouped(Long start) {
        if (grouped != null && !grouped.isEmpty() && grouped.containsKey("root_pid")) {
            SolrGroupDto group = grouped.get("root_pid");
            SolrResponseDto response = new SolrResponseDto();
            response.setNumFound(group.getNgroups());
            response.setStart(start);
            response.setDocs(group.getGroups().stream()
                    .filter(g -> g.getDoclist().getDocs().stream().findFirst().isPresent())
                    .map(g -> {
                        Map<String, Object> doc = new HashMap<>(g.getDoclist().getDocs().stream().findFirst().get());
                        doc.put("occurrences", g.getDoclist().getNumFound());
                        doc.put("fedora.model", doc.getOrDefault("model_path", doc.getOrDefault("fedora.model", "")).toString().split("/")[0].replace("[", "").replace("]", ""));
                        doc.put("PID", doc.getOrDefault("root_pid", doc.get("PID")));
                        doc.put("dc.title", doc.getOrDefault("root_title", doc.get("dc.title")));
                        return doc;
                    })
                    .collect(Collectors.toList()));
            setResponse(response);
        }
    }
}

