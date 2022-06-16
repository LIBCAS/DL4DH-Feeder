package cz.inqool.dl4dh.feeder.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.dto.Info.FeederVersionDto;
import cz.inqool.dl4dh.feeder.dto.Info.InfoDto;
import cz.inqool.dl4dh.feeder.dto.Info.KrameriusPlusVersionDto;
import cz.inqool.dl4dh.feeder.dto.Info.KrameriusVersionDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.util.HashMap;
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
        Map<Object, Object> krameriusInfo = krameriusPlus.get()
                .uri("/info").retrieve().bodyToMono(Map.class).block();
        ObjectMapper mapper = new ObjectMapper();
        return new InfoDto(
                new FeederVersionDto(version),
                mapper.convertValue(krameriusInfo.get("krameriusPlus"), KrameriusPlusVersionDto.class),
                mapper.convertValue(krameriusInfo.get("kramerius"), KrameriusVersionDto.class)
        );
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
