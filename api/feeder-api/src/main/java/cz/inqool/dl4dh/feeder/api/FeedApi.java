package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.PublicationDto;
import cz.inqool.dl4dh.feeder.dto.PublicationsListDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.FeedResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/feed")
public class FeedApi {

    private WebClient kramerius;
    private WebClient solrWebClient;

    private final HttpSolrClient solr;

    public FeedApi(@Value("${solr.host.query}") String solrHost) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @GetMapping(value = "/mostdesirable")
    public PublicationsListDto mostDesirable() {
        FeedResponseDto result = kramerius.get()
                .uri("/feed/mostdesirable")
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(FeedResponseDto.class)
                .block();

        return getPublicationsListDto(result);
    }

    @GetMapping(value = "/newest")
    public PublicationsListDto newest() {
        FeedResponseDto result = kramerius.get()
                .uri("/feed/newest")
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(FeedResponseDto.class)
                .block();

        return getPublicationsListDto(result);
    }

    @GetMapping(value = "/custom")
    public PublicationsListDto custom() {
        FeedResponseDto result = kramerius.get()
                .uri("/feed/newest")
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(FeedResponseDto.class)
                .block();

        return getPublicationsListDto(result);
    }

    private PublicationsListDto getPublicationsListDto(FeedResponseDto result) {
        if (result == null) {
            return new PublicationsListDto(0L, 0L, new ArrayList<>());
        }
        return new PublicationsListDto(
                (long) result.getData().size(),
                0L,
                result.getData().stream().map(d ->
                        new PublicationDto(
                                (String)d.get("model"),
                                (String)d.get("policy"),
                                (String)d.get("datumstr"),
                                (List<String>)d.get("author"),
                                (String)d.get("title"),
                                (String)d.get("pid"),
                                (String)d.get("root_title"),
                                solrWebClient.get()     // TODO do it only in one request for all publications
                                        .uri("/select", uriBuilder -> uriBuilder
                                                .queryParam("fl", "root_pid")
                                                .queryParam("q", "PID:\""+d.get("pid")+"\"")
                                                .queryParam("rows","0")
                                                .build())
                                        .acceptCharset(StandardCharsets.UTF_8)
                                        .accept(MediaType.APPLICATION_JSON)
                                        .retrieve()
                                        .bodyToMono(SolrQueryWithFacetResponseDto.class)
                                        .block().getResponse().getNumFound() > 0
                        )
                ).collect(Collectors.toList()));
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }
}
