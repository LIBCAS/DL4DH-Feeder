package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.KrameriusPlusDocumentDto;
import cz.inqool.dl4dh.feeder.dto.KrameriusPlusDocumentNameTagEntityDto;
import cz.inqool.dl4dh.feeder.dto.KrameriusPlusDocumentPageDto;
import cz.inqool.dl4dh.feeder.dto.SolrObjectDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import org.apache.solr.client.solrj.SolrServerException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/item")
public class ItemApi {

    private WebClient kramerius;

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @GetMapping("/{uuid}")
    public @ResponseBody Object item(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid).retrieve().bodyToMono(Object.class).block();
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
    public @ResponseBody ResponseEntity<ByteArrayResource> streamMods(@PathVariable(value="uuid") String uuid, @PathVariable(value="stream") String stream) {
        return kramerius.get()
                .uri("/item/"+uuid+"/streams/"+stream).retrieve().toEntity(ByteArrayResource.class).block();
    }
}
