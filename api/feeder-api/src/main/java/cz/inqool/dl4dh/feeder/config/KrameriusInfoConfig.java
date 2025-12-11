package cz.inqool.dl4dh.feeder.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.dto.info.FeederInfoDto;
import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import cz.inqool.dl4dh.feeder.dto.info.KrameriusPlusVersionDto;
import cz.inqool.dl4dh.feeder.dto.info.KrameriusVersionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.util.Map;

@Configuration
@Slf4j
public class KrameriusInfoConfig {

    private WebClient krameriusPlus;
    private final String version;
    private final String contact;

    public KrameriusInfoConfig(@Value("${info.app.version:unknown}") String version, @Value("${info.app.contact:unknown}") String contact) {
        this.version = version;
        this.contact = contact;
    }

    @Bean(name = "krameriusInfo")
    public InfoDto krameriusInfo() {
        Map<Object, Object> krameriusInfo = krameriusPlus.get()
                .uri("/info").retrieve().bodyToMono(new ParameterizedTypeReference<Map<Object, Object>>() {}).block();
        FeederInfoDto feederInfo = new FeederInfoDto(version, contact);
        ObjectMapper mapper = new ObjectMapper();
        return new InfoDto(
                feederInfo,
                krameriusInfo == null ? null : mapper.convertValue(krameriusInfo.get("krameriusPlus"), KrameriusPlusVersionDto.class),
                krameriusInfo == null ? null : mapper.convertValue(krameriusInfo.get("kramerius"), KrameriusVersionDto.class)
        );
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
