package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.PublicationDto;
import cz.inqool.dl4dh.feeder.dto.PublicationsListDto;
import cz.inqool.dl4dh.feeder.dto.SearchDto;
import cz.inqool.dl4dh.feeder.enums.EnrichmentEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.CollectionDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.repository.FilterRepository;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {
    private static final Logger log = LoggerFactory.getLogger(SearchService.class);
    private final HttpSolrClient feederSolr;
    private WebClient krameriusSolr;
    private WebClient feederSolrWebClient;
    private FilterRepository filterRepository;
    private CollectionService collectionService;

    public SearchServiceImpl(@Value("${solr.host.query}") String solrHost) {
        this.feederSolr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @Override
    public List<String> hint(String query) {
        return hint(query, null);
    }

    @Override
    public List<String> hint(String query, NameTagEntityType nameTagType) {
        Filter filters = new Filter();
        filters.setQuery(query);
        filters.setPageSize(20);

        if (nameTagType != null) {
            SolrQuery solrQuery = new SolrQuery();
            solrQuery.setFacet(true)
                    .setFacetLimit(filters.getPageSize());
            Arrays.stream(nameTagType.getSolrField().split(",")).forEach(solrQuery::addFacetField);
            solrQuery.setParam("facet.contains", filters.getQuery())
                    .setParam("facet.contains.ignoreCase", "true")
                    .setQuery(filters.toQuery())
                    .addFilterQuery(filters.toFqQuery(List.of("fedora.model:monograph", "fedora.model:periodical", "fedora.model:map", "fedora.model:sheetmusic", "fedora.model:monographunit", "fedora.model:page", "fedora.model:article"), true));
            if (filters.useEdismax()) {
                solrQuery.setParam("defType", "edismax")
                        .setParam("qf", filters.getEdismaxFields(true));
            }
            try {
                QueryResponse response = feederSolr.query(solrQuery);
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
            } catch (Exception ex) {
                log.error("An error occurred during hinting.", ex);
                return List.of();
            }
        }

        SolrQueryResponseDto result = krameriusSolr.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("defType", "edismax")
                        .queryParam("fl", "PID,dc.title")
                        .queryParam("q", "dc.title:" + query.replaceAll(":", "\\\\:") + "*")
                        .queryParam("fq", filters.toFqQuery(List.of("fedora.model:monograph", "fedora.model:periodical", "fedora.model:map", "fedora.model:sheetmusic", "fedora.model:monographunit"), false))
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
        return result.getResponse().getDocs().stream().map(d -> (String) d.get("dc.title")).collect(Collectors.toList());
    }

    @Override
    public void saveSearch(Filter filters, String username) {
        if (username != null && !username.isEmpty()) {
            filters.setUsername(username);
            // set reference from nametag filters to main filters object
            if (filters.getNameTagFilters() != null) {
                filters.getNameTagFilters().forEach(v -> v.setFilter(filters));
            }
            filterRepository.save(filters);
        }
    }

    private Set<String> reduceToEnrichedPIDs(Set<String> PIDs) {
        return feederSolrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("q", PIDs.stream().map(v -> "PID:\"" + v + "\"").collect(Collectors.joining(" OR ")))
                        .queryParam("rows", "0")
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field", "root_pid")
                        .queryParam("facet.limit", "100")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow()
                .getFacet_counts().transformed(false).get("root_pid").keySet();
    }

    @Override
    public SearchDto search(Filter filters) {
        boolean useEnriched = filters.useOnlyEnriched();

        List<String> filterBase = List.of("fedora.model:monograph", "fedora.model:periodical", "fedora.model:map", "fedora.model:sheetmusic", "fedora.model:monographunit");
        List<String> facetBase = List.of("keywords", "language", "facet_autor", "model_path", "dostupnost", "collection", "datum_begin");

        // Get documents from Feeder
        SolrQueryWithFacetResponseDto feederDocuments = feederSolrWebClient.get()
                .uri("/select", uriBuilder -> {
                    filters.applyFqQueryToUriBuilder(uriBuilder, filterBase, true)
                            .applyEdismaxToUriBuilder(uriBuilder, true);
                    if (filters.getNameTagFacet() != null && !filters.getNameTagFacet().isEmpty()) {
                        uriBuilder.queryParam("facet.contains", filters.getNameTagFacet());
                    }
                    facetBase.forEach(f -> uriBuilder.queryParam("facet.field", f));
                    Arrays.stream(NameTagEntityType.ALL.getSolrField().split(",")).forEach(f -> uriBuilder.queryParam("facet.field", f));
                    return uriBuilder.queryParam("q", filters.toQuery())
                            .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,root_title,datum_str,dnnt-labels")
                            .queryParam("facet", "true")
                            .queryParam("facet.mincount", "1")
                            .queryParam("facet.contains.ignoreCase", "true")
                            .queryParam("f.datum_begin.facet.limit", "-1")
                            .queryParam("f.collection.facet.limit", "-1")
                            .queryParam("start", filters.getStart())
                            .queryParam("rows", useEnriched ? filters.getPageSize() : 0)
                            .queryParam("sort", filters.getSort().toSolrSort(true))
                            .build();
                })
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow();

        // Get documents from Kramerius
        SolrQueryWithFacetResponseDto krameriusDocuments = krameriusSolr.get()
                .uri("/search", uriBuilder -> {
                    filters.applyFqQueryToUriBuilder(uriBuilder, filterBase, false)
                            .applyEdismaxToUriBuilder(uriBuilder, false);
                    facetBase.forEach(f -> uriBuilder.queryParam("facet.field", f));
                    return uriBuilder.queryParam("q", filters.toQuery())
                            .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,root_title,datum_str,dnnt-labels")
                            .queryParam("facet", "true")
                            .queryParam("facet.mincount", "1")
                            .queryParam("f.datum_begin.facet.limit", "-1")
                            .queryParam("f.collection.facet.limit", "-1")
                            .queryParam("start", filters.getStart())
                            .queryParam("rows", useEnriched ? 0 : filters.getPageSize())
                            .queryParam("sort", filters.getSort().toSolrSort(false))
                            .build();
                })
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow();

        // Use the right results
        SolrQueryWithFacetResponseDto result = useEnriched ? feederDocuments : krameriusDocuments;

        // Get PIDs of showing documents and check, if they are already enriched
        Set<String> documentsPIDs = result.getResponse().getDocs().stream()
                .map(d -> (String) d.get("PID"))
                .collect(Collectors.toSet());
        Set<String> enrichedPIDs = useEnriched ? documentsPIDs : reduceToEnrichedPIDs(documentsPIDs);

        // Nametag facets
        Map<String, Map<String, Object>> nametagFacets = feederDocuments.getFacet_counts().transformed(true);

        // Base facets
        Map<String, Map<String, Object>> facets = result.getFacet_counts()
                .transformed(false, collectionService.getCollections()
                        .stream()
                        .collect(Collectors.toMap(CollectionDto::getPid, Function.identity())
                        )
                );
        Integer allDocuments = result.getResponse().getNumFound().intValue();
        Integer finalEnriched = feederDocuments.getResponse().getNumFound().intValue();
        facets.put("enrichment", new HashMap<>() {{
            put(EnrichmentEnum.ENRICHED.toString(), finalEnriched);
            put(EnrichmentEnum.NOT_ENRICHED.toString(), allDocuments - finalEnriched);
            put(EnrichmentEnum.ALL.toString(), allDocuments);
        }});

        return new SearchDto(
                new PublicationsListDto(
                        result.getResponse().getNumFound(),
                        result.getResponse().getStart(),
                        result.getResponse().getDocs().stream().map(d ->
                                new PublicationDto(
                                        (String) d.get("fedora.model"),
                                        (String) d.get("dostupnost"),
                                        (String) d.get("datum_str"),
                                        (List<String>) d.get("dc.creator"),
                                        (String) d.get("dc.title"),
                                        (String) d.get("PID"),
                                        (String) d.get("root_title"),
                                        enrichedPIDs.contains((String) d.get("PID"))
                                )
                        ).collect(Collectors.toList())),
                facets,
                nametagFacets
        );
    }

    @Resource
    public void setFilterRepository(FilterRepository filterRepository) {
        this.filterRepository = filterRepository;
    }

    @Resource
    public void setCollectionService(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusSolr = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setFeederSolrWebClient(WebClient webClient) {
        this.feederSolrWebClient = webClient;
    }
}
