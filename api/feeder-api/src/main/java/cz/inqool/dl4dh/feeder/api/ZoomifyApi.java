package cz.inqool.dl4dh.feeder.api;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/zoomify")
public class ZoomifyApi {

    private WebClient zoomify;

    @Resource(name = "krameriusZoomifyWebClient")
    public void setWebClient(WebClient webClient) {
        this.zoomify = webClient;
    }

    @Operation(summary = "Get ImageProperties.xml file for an item. Needed for rendering a page from a publication")
    @GetMapping(
            value = "/{uuid}/ImageProperties.xml",
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public @ResponseBody ByteArrayResource properties(@PathVariable(value="uuid") String uuid) {
        return zoomify.get()
                .uri("/"+uuid+"/ImageProperties.xml").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @Operation(summary = "Download part of a page image")
    @GetMapping(
            value = "/{uuid}/{group}/{coords}.jpg",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource tile(@PathVariable(value="group") String group, @PathVariable(value="uuid") String uuid, @PathVariable(value="coords") String coords) {
        return zoomify.get()
                .uri("/"+uuid+"/"+group+"/"+coords+".jpg").retrieve().bodyToMono(ByteArrayResource.class).block();
    }
}
