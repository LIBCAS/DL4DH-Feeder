package cz.inqool.dl4dh.feeder.api;

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

    @GetMapping(
            value = "/{uuid}/ImageProperties.xml",
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public @ResponseBody ByteArrayResource properties(@PathVariable(value="uuid") String uuid) {
        return zoomify.get()
                .uri("/"+uuid+"/ImageProperties.xml").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @GetMapping(
            value = "/{uuid}/{group}/{coords}.jpg",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource tile(@PathVariable(value="group") String group, @PathVariable(value="uuid") String uuid, @PathVariable(value="coords") String coords) {
        return zoomify.get()
                .uri("/"+uuid+"/"+group+"/"+coords+".jpg").retrieve().bodyToMono(ByteArrayResource.class).block();
    }
}
