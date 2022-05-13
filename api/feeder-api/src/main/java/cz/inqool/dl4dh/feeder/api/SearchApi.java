package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/search")
public class SearchApi {

    private WebClient kramerius;

    @PostMapping(value = "/hint", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<HintDto> hint(@RequestBody FiltersDto filters) {
        SolrQueryResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("defType", "edismax")
                        .queryParam("fl", "PID,dc.title")
                        .queryParam("q", "dc.title:"+filters.getQuery()+"*")
                        .queryParam("fq", filters.toFqQuery())
                        .queryParam("bq", "fedora.model:monograph^5")
                        .queryParam("bq", "fedora.model:periodical^5")
                        .queryParam("bq", "dostupnost:public^5")
                        .queryParam("rows", "50")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryResponseDto.class)
                .block();
        return result.getResponse().getDocs().stream().map(d -> new HintDto((String)d.get("PID"), (String)d.get("dc.title"))).collect(Collectors.toList());
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody FiltersDto filters) {
        SolrQueryWithFacetResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,root_title,datum_str,dnnt-labels")
                        .queryParam("q", filters.getQuery().isEmpty() ? "*:*" : filters.getQuery())
                        .queryParam("fq", filters.toFqQuery())
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field","keywords")
                        .queryParam("facet.field","language")
                        .queryParam("facet.field","facet_autor")
                        .queryParam("facet.field","model_path")
                        .queryParam("facet.field","dostupnost")
                        .queryParam("facet.field","collection")
                        .queryParam("sort","created_date desc")
                        .queryParam("rows","60")
                        .queryParam("start","0")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .block();

        return new SearchDto(
                new PublicationsListDto(
                        result.getResponse().getNumFound(),
                        result.getResponse().getStart(),
                        result.getResponse().getDocs().stream().map(d ->
                                new PublicationDto(
                                        (String)d.get("fedora.model"),
                                        (String)d.get("dostupnost"),
                                        (String)d.get("datum_str"),
                                        (List<String>)d.get("dc.creator"),
                                        (String)d.get("dc.title"),
                                        (String)d.get("PID"),
                                        (String)d.get("root_title")
                                )
                        ).collect(Collectors.toList())),
                result.getFacet_counts().transformed());
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }
}
