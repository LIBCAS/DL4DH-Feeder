package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/item")
public class ItemApi {

    private WebClient kramerius;
    private WebClient solrWebClient;

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }

    @GetMapping("/{uuid}")
    public @ResponseBody Map<String, Object> item(@PathVariable(value="uuid") String uuid) {
        Map<String, Object> response = kramerius.get()
                .uri("/item/"+uuid).retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {}).block();
        Boolean enriched = solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("fl", "root_pid")
                        .queryParam("q", "PID:\""+response.get("pid")+"\"")
                        .queryParam("rows","0")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .block().getResponse().getNumFound() > 0;
        response.put("enriched", enriched);
        return response;
    }

    @GetMapping(
            value = "/{uuid}/thumb",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource thumb(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/thumb").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @GetMapping("/{uuid}/children")
    public @ResponseBody Object children(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/children").retrieve().bodyToMono(Object.class).block();
    }

    @GetMapping("/{uuid}/streams")
    public @ResponseBody Object streams(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/streams").retrieve().bodyToMono(Object.class).block();
    }

    @GetMapping("/{uuid}/streams/{stream}")
    public @ResponseBody ByteArrayResource streamMods(@PathVariable(value="uuid") String uuid, @PathVariable(value="stream") String stream) {
        return kramerius.get()
                .uri("/item/"+uuid+"/streams/"+stream).retrieve().bodyToMono(ByteArrayResource.class).block();
    }
}
