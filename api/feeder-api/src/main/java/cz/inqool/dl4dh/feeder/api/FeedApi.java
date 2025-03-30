package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.PublicationDto;
import cz.inqool.dl4dh.feeder.dto.PublicationsListDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.FeedResponseDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.SolrQueryWithFacetResponseDto;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Functionality from Kramerius 5. Get the most desirable publications.")
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

    @Operation(summary = "Functionality from Kramerius 5. Get the newest publications in the system.")
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

    @Operation(summary = "Functionality from Kramerius 5. Depends on the implementation in Kramerius 5.")
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

    private Set<String> reduceToEnrichedPIDs(Set<String> PIDs) {
        return solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("q", PIDs.stream().map(v -> "PID:\"" + v + "\"").collect(Collectors.joining(" OR ")))
                        .queryParam("rows", "0")
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field", "root_pid")
                        .queryParam("facet.limit", "500")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow()
                .getFacet_counts().transformed(false).get("root_pid").keySet();
    }

    private PublicationsListDto getPublicationsListDto(FeedResponseDto result) {
        if (result == null) {
            return new PublicationsListDto(0L, 0L, new ArrayList<>());
        }
        Set<String> enrichedPIDs = reduceToEnrichedPIDs(result
                .getData().stream()
                .map(d -> (String)d.get("pid"))
                .collect(Collectors.toSet()));
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
                                List.of(),
                                (String)d.get("root_title"),
                                enrichedPIDs.contains((String)d.get("pid")),
                                null
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
