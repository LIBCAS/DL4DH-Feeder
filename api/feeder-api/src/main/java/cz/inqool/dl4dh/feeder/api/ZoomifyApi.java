package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/zoomify")
public class ZoomifyApi {

    private WebClient zoomify;
    private final InfoDto info;
    private WebClient kramerius;

    public ZoomifyApi(InfoDto info) {
        this.info = info;
    }

    @Resource(name = "krameriusWebClient")
    public void setKrameriusWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "krameriusZoomifyWebClient")
    public void setWebClient(WebClient webClient) {
        this.zoomify = webClient;
    }

    @Operation(summary = "Get ImageProperties.xml file for an item. Needed for rendering a page from a publication")
    @GetMapping(
            value = "/{uuid}/ImageProperties.xml",
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public @ResponseBody ByteArrayResource properties(@PathVariable(value="uuid") String uuid) throws IOException {
        if (info.isVersion7()) {
            Map<String, Map<String, Boolean>> infoData =  kramerius.get()
                    .uri("/items/"+uuid+"/info/data").retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Map<String, Boolean>>>() {}).block();
            Map<String, Boolean> imageInfo = infoData.getOrDefault("image", new HashMap<>());
            String url = "/items/"+uuid+"/image";
            ByteArrayResource imageBytes = kramerius.get()
                    .uri(url).retrieve().bodyToMono(ByteArrayResource.class).block();
            BufferedImage bimg = ImageIO.read(imageBytes.getInputStream());
            int width          = bimg.getWidth();
            int height         = bimg.getHeight();
            return new ByteArrayResource(("<IMAGE_PROPERTIES WIDTH=\""+width+"\" HEIGHT=\""+height+"\" NUMTILES=\"1\" NUMIMAGES=\"1\" VERSION=\"1.8\" TILESIZE=\""+Integer.max(width, height)+"\"/>").getBytes());
        }
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
