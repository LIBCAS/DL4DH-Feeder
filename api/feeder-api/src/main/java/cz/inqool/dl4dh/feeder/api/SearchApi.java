package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.EnrichmentEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.CollectionDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/search")
public class SearchApi {

    private WebClient kramerius;
    private WebClient krameriusPrint;
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
                    .setFacetLimit(filters.getPageSize());
            Arrays.stream(nameTagType.getSolrField().split(",")).forEach(query::addFacetField);
            query.setParam("facet.contains", filters.getQuery())
                    .setParam("facet.contains.ignoreCase", "true")
                    .setQuery(filters.toQuery())
                    .addFilterQuery(filters.toFqQuery(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit","fedora.model:page","fedora.model:article"), true));
            if (filters.useEdismax()) {
                query.setParam("defType", "edismax")
                        .setParam("qf", filters.getEdismaxFields(true));
            }
            QueryResponse response = solr.query(query);
            return Arrays.stream(nameTagType.getSolrField().split(","))
                    .map(f -> response.getFacetField(f)
                            .getValues()
                            .stream()
                            .map(FacetField.Count::getName)
                            .collect(Collectors.toList()))
                    .flatMap(Collection::stream)
                    .distinct()
                    .sorted()
                    .limit(filters.getPageSize())
                    .collect(Collectors.toList());
        }

        SolrQueryResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("defType", "edismax")
                        .queryParam("fl", "PID,dc.title")
                        .queryParam("q", "dc.title:"+q.replaceAll(":","\\\\:")+"*")
                        .queryParam("fq", filters.toFqQuery(List.of("fedora.model:monograph","fedora.model:periodical","fedora.model:map","fedora.model:sheetmusic","fedora.model:monographunit"), false))
                        .queryParam("bq", "fedora.model:monograph^5")
                        .queryParam("bq", "fedora.model:periodical^5")
                        .queryParam("bq", "dostupnost:public^5")
                        .queryParam("rows", filters.getPageSize())
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryResponseDto.class)
                .blockOptional()
                .orElseThrow();
        return result.getResponse().getDocs().stream().map(d -> (String)d.get("dc.title")).collect(Collectors.toList());
    }

    private Map<String, Map<String, Object>> getNameTagFacets(FiltersDto filters) {
        return solrWebClient.get()
                .uri("/select", uriBuilder -> {
                    uriBuilder
                            .queryParam("q", filters.toQuery())
                            .queryParam("facet", "true")
                            .queryParam("facet.mincount", "1")
                            .queryParam("facet.contains.ignoreCase", "true");
                    if (filters.useEdismax()) {
                        uriBuilder.queryParam("defType", "edismax")
                                .queryParam("qf", filters.getEdismaxFields(true));
                    }
                    if (filters.getNameTagFacet() != null && !filters.getNameTagFacet().isEmpty()) {
                        uriBuilder.queryParam("facet.contains", filters.getNameTagFacet());
                    }
                    Arrays.stream(NameTagEntityType.ALL.getSolrField().split(",")).forEach(f -> uriBuilder.queryParam("facet.field",f));
                    return uriBuilder.queryParam("rows",0)
                            .build();
                })
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow()
                .getFacet_counts()
                .transformed();
    }

    private Set<String> reduceToEnrichedPIDs(Set<String> PIDs) {
        return solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("q", PIDs.stream().map(v -> "PID:\""+v+"\"").collect(Collectors.joining(" OR ")))
                        .queryParam("rows","0")
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
                .getFacet_counts().transformed().get("root_pid").keySet();
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody FiltersDto filters) {
        // Search in Kramerius+
        // TODO change getting ids from facet to only one call on K+ solr (because of wrong get of ids from K solr and limit of facet)
        SolrQueryWithFacetResponseDto resultKPlus = solrWebClient.get()
                .uri("/select", uriBuilder -> {
                    uriBuilder
                            .queryParam("q", filters.toQuery())
                            .queryParam("facet", "true")
                            .queryParam("facet.mincount", "1")
                            .queryParam("facet.field", "root_pid")
                            .queryParam("facet.limit", "500")
                            .queryParam("rows",0);
                    if (filters.useEdismax()) {
                        uriBuilder.queryParam("defType", "edismax")
                                .queryParam("qf", filters.getEdismaxFields(true));
                    }
                    return uriBuilder.build();
                })
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow();
        Map<String, Object> kPlusRootPids = resultKPlus.getFacet_counts().transformed().get("root_pid");
        int enriched = kPlusRootPids.size();

        // Search in Kramerius
        SolrQueryWithFacetResponseDto result = kramerius.get()
                .uri("/search", uriBuilder -> {
                    if (filters.useOnlyEnriched()) {
                        uriBuilder.queryParam("q", kPlusRootPids.keySet().stream().map(v -> "PID:\"" + v + "\"").skip(filters.getStart()).limit(filters.getPageSize()).collect(Collectors.joining(" OR ")));
                    }
                    else {
                        uriBuilder.queryParam("q", filters.toQuery())
                                .queryParam("rows", filters.getPageSize())
                                .queryParam("start", filters.getStart());
                        if (filters.useEdismax()) {
                            uriBuilder.queryParam("defType", "edismax")
                                    .queryParam("qf", filters.getEdismaxFields(false));
                        }
                    }
                    return uriBuilder.queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,root_title,datum_str,dnnt-labels")
                            .queryParam("fq", filters.toFqQuery(List.of("fedora.model:monograph", "fedora.model:periodical", "fedora.model:map", "fedora.model:sheetmusic", "fedora.model:monographunit"), false))
                            .queryParam("facet", "true")
                            .queryParam("facet.mincount", "1")
                            .queryParam("facet.field", "keywords")
                            .queryParam("facet.field", "language")
                            .queryParam("facet.field", "facet_autor")
                            .queryParam("facet.field", "model_path")
                            .queryParam("facet.field", "dostupnost")
                            .queryParam("facet.field", "collection")
                            .queryParam("facet.field", "datum_begin")
                            .queryParam("f.datum_begin.facet.limit", "-1")
                            .queryParam("f.collection.facet.limit", "-1")
                            .queryParam("sort", filters.getSort().toSolrSort())
                            .build();
                })
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow();

        // Prepare collections for facets
        List<CollectionDto> collectionsList = kramerius.get().uri("/vc").retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CollectionDto>>() {}).block();
        Map<String, CollectionDto> collections = collectionsList == null ? new HashMap<>() : collectionsList.stream()
                .collect(Collectors.toMap(CollectionDto::getPid, Function.identity()));

        // Add new facet enrichment as a combination of results from Kramerius and Kramerius+
        Integer allDocuments = filters.useOnlyEnriched() ? enriched : result.getResponse().getNumFound().intValue();
        Integer finalEnriched = enriched;
        Map<String, Map<String, Object>> facets = result.getFacet_counts().transformed(collections);
        facets.put("enrichment", new HashMap<>(){{
            put(EnrichmentEnum.ENRICHED.toString(), finalEnriched);
            put(EnrichmentEnum.NOT_ENRICHED.toString(), allDocuments - finalEnriched);
            put(EnrichmentEnum.ALL.toString(), allDocuments);
        }});

        // Get PIDs of showing documents and check, if they are already enriched
        Set<String> enrichedPIDs = reduceToEnrichedPIDs(result
                .getResponse().getDocs().stream()
                .map(d -> (String)d.get("PID"))
                .collect(Collectors.toSet()));
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
                                        enrichedPIDs.contains((String)d.get("PID"))
                                )
                        ).collect(Collectors.toList())),
                facets,
                getNameTagFacets(filters));
    }

    @GetMapping(value = "/collections")
    public @ResponseBody List<CollectionDto> collections() {
        return kramerius.get().uri("/vc").retrieve().bodyToMono(new ParameterizedTypeReference<List<CollectionDto>>() {}).block();
    }

    @GetMapping(value = "/localPrintPDF", produces = "application/pdf")
    public @ResponseBody ByteArrayResource print(@RequestParam String pids, @RequestParam Optional<String> pagesize, @RequestParam Optional<String> imgop) {
        return krameriusPrint.get().uri(uriBuilder -> uriBuilder.queryParam("pids",pids)
                        .queryParam("pagesize", pagesize.orElse("A4"))
                        .queryParam("imgop", imgop.orElse("FULL"))
                        .build()).retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "krameriusPrintWebClient")
    public void setPrintWebClient(WebClient webClient) {
        this.krameriusPrint = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }
}
