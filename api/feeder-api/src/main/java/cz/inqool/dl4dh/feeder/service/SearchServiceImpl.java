package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.PublicationDto;
import cz.inqool.dl4dh.feeder.dto.PublicationsListDto;
import cz.inqool.dl4dh.feeder.dto.SearchDto;
import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import cz.inqool.dl4dh.feeder.enums.AvailabilityEnum;
import cz.inqool.dl4dh.feeder.enums.EnrichmentEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.CollectionDto;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryWithFacetResponseDto;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.repository.FilterRepository;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Mono;

import javax.annotation.Resource;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Consumer;
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
    private InfoDto info;
    private final List<String> publicPolicies;
    private final KrameriusSolrFieldsService krameriusSolrFields;
    private final KrameriusSolrFieldsService feederSolrFields;

    public SearchServiceImpl(@Value("${solr.host.query}") String solrHost,
                             @Value("${system.kramerius.publicPolicies}") String publicPolicies,
                             @Qualifier("krameriusSolrFields") KrameriusSolrFieldsService krameriusSolrFields,
                             @Qualifier("feederSolrFields") KrameriusSolrFieldsService feederSolrFields) {
        this.feederSolr = new HttpSolrClient.Builder(solrHost.trim()).build();
        this.publicPolicies = List.of(publicPolicies.split(","));
        this.krameriusSolrFields = krameriusSolrFields;
        this.feederSolrFields =  feederSolrFields;
    }

    @Override
    public List<String> hint(String query, boolean publicOnly) {
        return hint(query, null, publicOnly);
    }

    @Override
    public List<String> hint(String query, NameTagEntityType nameTagType, boolean publicOnly) {
        Filter filters = new Filter();
        filters.setQuery(query);
        filters.setPageSize(20);
        if (publicOnly) {
            filters.setAvailability(AvailabilityEnum.PUBLIC);
        }

        if (nameTagType != null) {
            SolrQuery solrQuery = new SolrQuery();
            solrQuery.setFacet(true)
                    .setFacetLimit(filters.getPageSize());
            Arrays.stream(nameTagType.getSolrField().split(",")).forEach(solrQuery::addFacetField);
            solrQuery.setParam("facet.contains", filters.getQuery())
                    .setParam("facet.contains.ignoreCase", "true")
                    .setQuery(filters.toQuery(feederSolrFields))
                    .addFilterQuery(filters.toFqQuery(List.of(
                            feederSolrFields.model()+":monograph",
                            feederSolrFields.model()+":periodical",
                            feederSolrFields.model()+":map",
                            feederSolrFields.model()+":sheetmusic",
                            feederSolrFields.model()+":monographunit",
                            feederSolrFields.model()+":page",
                            feederSolrFields.model()+":article"), true, new Kramerius5SolrFieldsServiceImpl(), publicPolicies));
            if (filters.useEdismax()) {
                solrQuery.setParam("defType", "edismax")
                        .setParam("qf", filters.getEdismaxFields(true, feederSolrFields));
            }
            if (!filters.useEdismax() && filters.getQuery() != null &&  !filters.getQuery().isEmpty()) {
                solrQuery.setParam("q1", filters.getQuery());
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
                        .queryParam("fl", krameriusSolrFields.pid()+","+ krameriusSolrFields.title())
                        .queryParam("qf", krameriusSolrFields.title())
                        .queryParam("q", String.join(" AND ", query.replaceAll(":", "\\\\:").split(" ")) + "*")
                        .queryParam("fq", filters.toFqQuery(List.of(
                                krameriusSolrFields.model()+":monograph",
                                krameriusSolrFields.model()+":periodical",
                                krameriusSolrFields.model()+":map",
                                krameriusSolrFields.model()+":sheetmusic",
                                krameriusSolrFields.model()+":monographunit"), false, krameriusSolrFields, publicPolicies))
                        .queryParam("bq", krameriusSolrFields.model()+":monograph^5")
                        .queryParam("bq", krameriusSolrFields.model()+":periodical^5")
                        .queryParam("bq", krameriusSolrFields.accessibility()+":public^5")
                        .queryParam("rows", filters.getPageSize())
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryResponseDto.class)
                .blockOptional()
                .orElseThrow();
        return result.getResponse().getDocs().stream().map(d -> (String) d.get(krameriusSolrFields.title())).distinct().collect(Collectors.toList());
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
                        .queryParam("q", PIDs.stream().map(v -> feederSolrFields.pid()+":\"" + v + "\"").collect(Collectors.joining(" OR ")))
                        .queryParam("rows", "0")
                        .queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.field", feederSolrFields.rootPid())
                        .queryParam("facet.limit", "100")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .blockOptional()
                .orElseThrow()
                .getFacet_counts().transformed(false).get(feederSolrFields.rootPid()).keySet();
    }

    @Override
    public boolean areEnriched(Set<String> PIDs) {
        return reduceToEnrichedPIDs(PIDs).size() == PIDs.size();
    }

    @Override
    public SearchDto search(Filter filters) {
        boolean useEnriched = filters.useOnlyEnriched();

        // Filter only basic types of documents if a page is not selected as a model
        List<String> filterBase = krameriusSolrFields.filterBaseList(filters.isSearchThroughPages(), !filters.isSearchThroughPages() && !filters.getQuery().isEmpty());
        List<String> filterBaseFeeder = feederSolrFields.filterBaseList(filters.isSearchThroughPages(), !filters.isSearchThroughPages() && !filters.getQuery().isEmpty());
        List<String> facetBase = krameriusSolrFields.facetBaseList();
        List<String> facetBaseFeeder = feederSolrFields.facetBaseList();

        // Function for creating web client query
        BiFunction<Boolean, Filter, Function<UriBuilder, URI>> urlFunctionBuilder = (useFeeder, filter) -> (uriBuilder) -> {
            List<String> filterList = useFeeder ? filterBaseFeeder : filterBase;
            KrameriusSolrFieldsService solrFieldsService = useFeeder ? feederSolrFields : krameriusSolrFields;

            // Set basic queries
            filter.applyFqQueryToUriBuilder(uriBuilder, filterList, useFeeder, solrFieldsService, publicPolicies)
                    .applyEdismaxToUriBuilder(uriBuilder, useFeeder, solrFieldsService);
            uriBuilder.queryParam("q", filter.toQuery(solrFieldsService))
                    .queryParam("fl", solrFieldsService.pid()+","+ solrFieldsService.accessibility()+","+ solrFieldsService.model()+","+ solrFieldsService.author()+","+ solrFieldsService.title()+","+ solrFieldsService.rootTitle()+","+ solrFieldsService.rootPid()+","+ solrFieldsService.modelPath()+","+ solrFieldsService.parentPid()+","+ solrFieldsService.date()+","+ solrFieldsService.licenses())
                    .queryParam("start", filter.getStart())
                    .queryParam("rows", filter.getPageSize());

            // Set facets filters and response
            if (filter.getReturnFacets()) {
                List<String> facetList = useFeeder ? facetBaseFeeder : facetBase;
                facetList.forEach(f -> uriBuilder.queryParam("facet.field", f));
                if (useFeeder) {
                    Arrays.stream(NameTagEntityType.ALL.getSolrField().split(",")).forEach(f -> uriBuilder.queryParam("facet.field", f));
                    if (filter.getNameTagFacet() != null && !filter.getNameTagFacet().isEmpty()) {
                        Arrays.stream(NameTagEntityType.ALL.getSolrField().split(",")).forEach(f -> uriBuilder.queryParam("f."+f+".facet.contains", filter.getNameTagFacet()));
                    }
                }
                uriBuilder.queryParam("facet", "true")
                        .queryParam("facet.mincount", "1")
                        .queryParam("facet.contains.ignoreCase", "true")
                        .queryParam("f.datum_begin.facet.limit", "-1")
                        .queryParam("f.collection.facet.limit", "-1");
            }

            // Use group search if there is a query text
            if (!filter.getQuery().isEmpty()) {
                uriBuilder.queryParam("q1", filter.getQuery())
                        .queryParam("group", "true")
                        .queryParam("group.field", solrFieldsService.rootPid())
                        .queryParam("group.ngroups", "true")
                        .queryParam("group.sort", "score desc")
                        .queryParam("group.truncate", "true");
                Map<String, String> urlParams = new HashMap<>();
                // This is a little bit different query than the query for kramerius solr, because feeder solr
                // does not contain fields level, text_ocr and mods.shelfLocator
                urlParams.put("edismax", "{!edismax qf='"+ solrFieldsService.title()+"^10 "+ solrFieldsService.author()+"^2 "+ solrFieldsService.keywords()+(useFeeder ? "'" : " "+solrFieldsService.textOcr()+"^0.1' bq='(level:0)^200'")+" bq='("+ solrFieldsService.accessibility()+":public)^2' bq='("+ solrFieldsService.model()+":page)^0.1' v=$q1}");
                return uriBuilder.build(urlParams);
            }
            else {
                uriBuilder.queryParam("sort", filter.getSort().toSolrSort(useFeeder, solrFieldsService));
            }
            return uriBuilder.build();
        };

        // Call correct query and process grouped response
        BiFunction<Boolean, Filter, SolrQueryWithFacetResponseDto> fetchSolr = (useFeeder, filter) -> {
            WebClient webclient = useFeeder ? feederSolrWebClient : krameriusSolr;
            KrameriusSolrFieldsService solrFields = useFeeder ? feederSolrFields : krameriusSolrFields;
            SolrQueryWithFacetResponseDto temp = webclient.get()
                    .uri(useFeeder ? "/select" : "/search", urlFunctionBuilder.apply(useFeeder, filters))
                    .acceptCharset(StandardCharsets.UTF_8)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .onStatus(HttpStatus::isError, res -> {
                        res.toEntity(String.class).subscribe(entity -> log.error("Client error {}", entity));
                        return Mono.error(new HttpClientErrorException(res.statusCode()));
                    })
                    .bodyToMono(SolrQueryWithFacetResponseDto.class)
                    .blockOptional()
                    .orElseThrow();
            temp.processGrouped(Long.valueOf(filter.getStart()), solrFields);
            return temp;
        };

        // Store previous values
        Integer previousPageSize = filters.getPageSize();
        Boolean previousReturnFacets = filters.getReturnFacets();
        AvailabilityEnum previousAvailability = filters.getAvailability();

        // Get documents from Feeder and Kramerius
        SolrQueryWithFacetResponseDto feederDocuments = fetchSolr.apply(true, filters.pageSize(useEnriched ? previousPageSize : 0));
        SolrQueryWithFacetResponseDto krameriusDocuments = fetchSolr.apply(false, filters.pageSize(useEnriched ? 0 : previousPageSize));

        // Use the right final results
        SolrQueryWithFacetResponseDto result = useEnriched ? feederDocuments : krameriusDocuments;

        // Get PIDs of showing documents and check, if they are already enriched
        Set<String> documentsPIDs = result.getResponse().getDocs().stream()
                .map(d -> (String) d.get(useEnriched ? feederSolrFields.pid() : krameriusSolrFields.pid()))
                .collect(Collectors.toSet());
        Set<String> enrichedPIDs = useEnriched ? documentsPIDs : reduceToEnrichedPIDs(documentsPIDs);

        // Nametag facets
        Map<String, Map<String, Object>> nametagFacets = feederDocuments.getFacet_counts().transformed(true);

        // Base facets
        Map<String, Map<String, Object>> facets = result.getFacet_counts()
                .transformed(false, collectionService.getCollections()
                        .stream()
                        .collect(Collectors.toMap(CollectionDto::getPid, Function.identity()))
                );
        Integer allDocuments = result.getResponse().getNumFound().intValue();
        Integer finalEnriched = feederDocuments.getResponse().getNumFound().intValue();
        facets.put("enrichment", new HashMap<>() {{
            put(EnrichmentEnum.ENRICHED.toString(), finalEnriched);
            put(EnrichmentEnum.NOT_ENRICHED.toString(), allDocuments - finalEnriched);
            put(EnrichmentEnum.ALL.toString(), allDocuments);
        }});

        if (info.isVersion7()) {
            if (facets.containsKey(krameriusSolrFields.keywords())) {
                facets.put(feederSolrFields.keywords(), facets.get(krameriusSolrFields.keywords()));
                facets.remove(krameriusSolrFields.keywords());
            }
            if (facets.containsKey(krameriusSolrFields.accessibility())) {
                SolrQueryWithFacetResponseDto publicDocuments = fetchSolr.apply(false, filters.pageSize(0)
                        .returnFacets(false)
                        .availability(AvailabilityEnum.PUBLIC));
                SolrQueryWithFacetResponseDto privateDocuments = fetchSolr.apply(false, filters.pageSize(0)
                        .returnFacets(false)
                        .availability(AvailabilityEnum.PRIVATE));

                // Count all public policies together
                Map<String, Object> availabilityCounts = new HashMap<>();
                availabilityCounts.put("public", publicDocuments.getResponse().getNumFound());
                availabilityCounts.put("private", privateDocuments.getResponse().getNumFound());
                facets.put("availability", availabilityCounts);
                facets.remove(krameriusSolrFields.accessibility());
            }
            if (facets.containsKey(krameriusSolrFields.language())) {
                facets.put(feederSolrFields.language(), facets.get(krameriusSolrFields.language()));
                facets.remove(krameriusSolrFields.language());
            }
            if (facets.containsKey(krameriusSolrFields.authorFacet())) {
                facets.put(feederSolrFields.authorFacet(), facets.get(krameriusSolrFields.authorFacet()));
                facets.remove(krameriusSolrFields.authorFacet());
            }
            if (facets.containsKey(krameriusSolrFields.collection())) {
                facets.put(feederSolrFields.collection(), facets.get(krameriusSolrFields.collection()));
                facets.remove(krameriusSolrFields.collection());
            }
//            if (facets.containsKey(krameriusSolrFields.dateYearFrom())) {
//                facets.put(feederSolrFields.dateYearFrom(), facets.get(krameriusSolrFields.dateYearFrom()));
//                facets.remove(krameriusSolrFields.dateYearFrom());
//            }
            if (facets.containsKey(krameriusSolrFields.modelPath())) {
                facets.put(feederSolrFields.modelPath(), facets.get(krameriusSolrFields.modelPath()));
                facets.remove(krameriusSolrFields.modelPath());
            }
        }

        return new SearchDto(
                new PublicationsListDto(
                        result.getResponse().getNumFound(),
                        result.getResponse().getStart(),
                        result.getResponse().getDocs().stream().map(d ->
                                new PublicationDto(
                                        (String) d.get(useEnriched ? feederSolrFields.model() : krameriusSolrFields.model()),
                                        PublicationDto.convertK7Accessibility(d.get(useEnriched ? feederSolrFields.accessibility() : krameriusSolrFields.accessibility()), publicPolicies),
                                        (String) d.get(useEnriched ? feederSolrFields.date() : krameriusSolrFields.date()),
                                        transformStringToArray(d.get(useEnriched ? feederSolrFields.author() : krameriusSolrFields.author())),
                                        (String) d.getOrDefault(useEnriched ? feederSolrFields.title() : krameriusSolrFields.title(), d.get(useEnriched ? feederSolrFields.rootTitle() : krameriusSolrFields.rootTitle())),
                                        (String) d.get(useEnriched ? feederSolrFields.pid() : krameriusSolrFields.pid()),
                                        transformStringToArray(d.get(useEnriched ? feederSolrFields.parentPid() : krameriusSolrFields.parentPid())),
                                        (String) d.get(useEnriched ? feederSolrFields.rootTitle() : krameriusSolrFields.rootTitle()),
                                        enrichedPIDs.contains((String)d.get(useEnriched ? feederSolrFields.pid() : krameriusSolrFields.pid())),
                                        (Long) d.getOrDefault("occurrences", null)
                                )
                        ).collect(Collectors.toList())),
                facets,
                nametagFacets
        );
    }

    private static List<String> transformStringToArray(Object value) {
        if (value instanceof String) {
            ArrayList<String> result = new ArrayList<String>();
            result.add((String) value);
            return result;
        }
        return (List<String>)value;
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

    @Resource(name = "krameriusInfo")
    public void setInfo(InfoDto info) {
        this.info = info;
    }
}
