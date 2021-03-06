package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.EnrichmentEnum;
import cz.inqool.dl4dh.feeder.enums.FilterOperatorEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrGroupItemDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.beans.DocumentObjectBinder;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocumentList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/search")
public class SearchApi {

    private WebClient kramerius;
    private WebClient solrWebClient;

    private final HttpSolrClient solr;

    public SearchApi(@Value("${solr.host.query}") String solrHost) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @PostMapping(value = "/hint", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> hint(@RequestParam String q, @RequestParam(required = false) NameTagEntityType nameTagType) throws SolrServerException, IOException {
        FiltersDto filters = new FiltersDto();
        filters.setQuery(q);
        filters.setPageSize(20);

        if (nameTagType != null) {
            SolrQuery query = new SolrQuery();
            query.setFacet(true)
                    .setFacetLimit(filters.getPageSize())
                    .addFacetField(nameTagType.getSolrField())
                    .setFacetPrefix(filters.getQuery())
                    .addFilterQuery(filters.toFqQuery(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit","fedora.model:page","fedora.model:article")));
            return solr.query(query)
                    .getFacetField(nameTagType.getSolrField())
                    .getValues()
                    .stream()
                    .map(FacetField.Count::getName)
                    .collect(Collectors.toList());
        }

        SolrQueryResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("defType", "edismax")
                        .queryParam("fl", "PID,dc.title")
                        .queryParam("q", "dc.title:"+q.replaceAll(":","\\\\:")+"*")
                        .queryParam("fq", filters.toFqQuery(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit")))
                        .queryParam("bq", "fedora.model:monograph^5")
                        .queryParam("bq", "fedora.model:periodical^5")
                        .queryParam("bq", "dostupnost:public^5")
                        .queryParam("rows", filters.getPageSize())
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryResponseDto.class)
                .block();
        return result.getResponse().getDocs().stream().map(d -> (String)d.get("dc.title")).collect(Collectors.toList());
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody FiltersDto filters) {
        // Search in Kramerius+
        List<String> ids = null;
        SolrQueryWithFacetResponseDto resultKPlus = solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("fl", "root_pid")
                        .queryParam("q", filters.toQuery())
                        .queryParam("group", "true")
                        .queryParam("group.ngroups", "true")
                        .queryParam("group.field", "root_pid")
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field","nameTag.numbersInAddresses")
                        .queryParam("facet.field","nameTag.geographicalNames")
                        .queryParam("facet.field","nameTag.institutions")
                        .queryParam("facet.field","nameTag.mediaNames")
                        .queryParam("facet.field","nameTag.numberExpressions")
                        .queryParam("facet.field","nameTag.artifactNames")
                        .queryParam("facet.field","nameTag.personalNames")
                        .queryParam("facet.field","nameTag.timeExpression")
                        .queryParam("facet.field","nameTag.complexPersonNames")
                        .queryParam("facet.field","nameTag.complexTimeExpression")
                        .queryParam("facet.field","nameTag.complexAddressExpression")
                        .queryParam("facet.field","nameTag.complexBiblioExpression")
                        .queryParam("sort",filters.getSort().toSolrSort())
                        .queryParam("rows",filters.getPageSize())
                        .queryParam("start",filters.getStart())
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .block();
        Integer enriched = resultKPlus.getGrouped().get("root_pid").getNgroups();
        if (filters.useOnlyEnriched()) {
            ids = resultKPlus.getGrouped().get("root_pid").getGroups().stream().map(SolrGroupItemDto::getGroupValue).collect(Collectors.toList());
        }

        // Search in Kramerius
        List<String> finalIds = ids;
        SolrQueryWithFacetResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,root_title,datum_str,dnnt-labels")
                        .queryParam("q", finalIds != null ? finalIds.stream().map(v -> "PID:\""+v+"\"").collect(Collectors.joining(" OR ")) :  filters.toQuery())
                        .queryParam("fq", filters.toFqQuery(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit")))
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field","keywords")
                        .queryParam("facet.field","language")
                        .queryParam("facet.field","facet_autor")
                        .queryParam("facet.field","model_path")
                        .queryParam("facet.field","dostupnost")
                        .queryParam("facet.field","collection")
                        .queryParam("facet.field","datum_begin")
                        .queryParam("f.datum_begin.facet.limit","-1")
                        .queryParam("sort",filters.getSort().toSolrSort())
                        .queryParam("rows",filters.getPageSize())
                        .queryParam("start",filters.getStart())
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .block();

        // Add new facet enrichment as a combination of results from Kramerius and Kramerius+
        Integer notEnriched = filters.useOnlyEnriched() ? enriched : result.getResponse().getNumFound().intValue();
        Map<String, Map<String, Integer>> facets = result.getFacet_counts().transformed();
        facets.put("enrichment", new HashMap<>(){{
            put(EnrichmentEnum.ENRICHED.toString(), enriched);
            put(EnrichmentEnum.NOT_ENRICHED.toString(), notEnriched - enriched);
            put(EnrichmentEnum.ALL.toString(), notEnriched);
        }});

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
                                        (String)d.get("root_title"),
                                        solrWebClient.get()     // TODO do it only in one request for all publications
                                                .uri("/select", uriBuilder -> uriBuilder
                                                        .queryParam("fl", "root_pid")
                                                        .queryParam("q", "PID:\""+d.get("PID")+"\"")
                                                        .queryParam("rows","0")
                                                        .build())
                                                .acceptCharset(StandardCharsets.UTF_8)
                                                .accept(MediaType.APPLICATION_JSON)
                                                .retrieve()
                                                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                                                .block().getResponse().getNumFound() > 0
                                )
                        ).collect(Collectors.toList())),
                facets,
                resultKPlus.getFacet_counts().transformed());
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
