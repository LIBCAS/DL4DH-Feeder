package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.Info.InfoDto;
import cz.inqool.dl4dh.feeder.dto.Info.KrameriusInfoDto;
import cz.inqool.dl4dh.feeder.dto.Info.KrameriusPlusVersionDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.util.Map;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/info")
public class InfoApi {

    private WebClient krameriusPlus;
    private final String version;

    public InfoApi(@Value("${info.app.version:unknown}") String version) {
        this.version = version;
    }

    @GetMapping
    public InfoDto info() {
        KrameriusPlusVersionDto plusInfo = krameriusPlus.get()
                .uri("/info/version").retrieve().bodyToMono(KrameriusPlusVersionDto.class).block();
        KrameriusInfoDto krameriuInfo = krameriusPlus.get()
                .uri("/info/kramerius").retrieve().bodyToMono(KrameriusInfoDto.class).block();
        return new InfoDto(version, krameriuInfo.krameriusInfoDto(), plusInfo);
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
