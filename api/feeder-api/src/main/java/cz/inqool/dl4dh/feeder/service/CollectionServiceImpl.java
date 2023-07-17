package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.kramerius.CollectionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.util.*;

@Service
public class CollectionServiceImpl implements CollectionService {
    private static final Logger log = LoggerFactory.getLogger(CollectionServiceImpl.class);
    private WebClient krameriusSolr;

    @Cacheable(value = "collections")
    public List<CollectionDto> getCollections() {
        log.debug("Loading collections from Kramerius into cache");
        return krameriusSolr.get().uri("/vc").retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CollectionDto>>() {
                })
                .blockOptional()
                .orElse(List.of());
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusSolr = webClient;
    }
}
