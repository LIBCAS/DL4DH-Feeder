package cz.inqool.dl4dh.feeder.kramerius;

import cz.inqool.dl4dh.feeder.service.KrameriusSolrFieldsService;
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

    public void processGrouped(Long start, KrameriusSolrFieldsService fields) {
        if (grouped != null && !grouped.isEmpty() && (grouped.containsKey("root_pid") || grouped.containsKey("root.pid"))) {
            SolrGroupDto group = grouped.getOrDefault("root_pid", grouped.get("root.pid"));
            SolrResponseDto response = new SolrResponseDto();
            response.setNumFound(group.getNgroups());
            response.setStart(start);
            response.setDocs(group.getGroups().stream()
                    .filter(g -> g.getDoclist().getDocs().stream().findFirst().isPresent())
                    .map(g -> {
                        Map<String, Object> doc = new HashMap<>(g.getDoclist().getDocs().stream().findFirst().get());
                        doc.put("occurrences", g.getDoclist().getNumFound());
                        doc.put(fields.model(), doc.getOrDefault("model_path", doc.getOrDefault("own_model_path", doc.getOrDefault("fedora.model",""))).toString().split("/")[0].replace("[", "").replace("]", ""));
                        doc.put(fields.pid(), doc.getOrDefault("root_pid", doc.getOrDefault("root.pid", doc.get("PID"))));
                        doc.put(fields.title(), doc.getOrDefault("root_title", doc.getOrDefault("root.title", doc.getOrDefault("dc.title", doc.get("own_parent.title")))));
                        return doc;
                    })
                    .collect(Collectors.toList()));
            setResponse(response);
        }
    }
}

