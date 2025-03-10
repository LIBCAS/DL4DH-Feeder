package cz.inqool.dl4dh.feeder.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.dto.ChildSearchDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.dto.kramerius.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.SolrQueryWithHighlightResponseDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.SolrQueryWithFacetResponseDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.StreamDto;
import cz.inqool.dl4dh.feeder.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/item")
public class ItemApi {

    private WebClient kramerius;
    private WebClient solrWebClient;

    private final HttpSolrClient solr;
    private final SearchService searchService;

    private final ObjectMapper objectMapper;

    public ItemApi(@Value("${solr.host.query}") String solrHost, SearchService searchService, ObjectMapper objectMapper) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
        this.searchService = searchService;
        this.objectMapper = objectMapper;
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }

    @Operation(summary = "Get a publication/item")
    @GetMapping("/{uuid}")
    public @ResponseBody Map<String, Object> item(@PathVariable(value="uuid") String uuid) {
        Map<String, Object> response = kramerius.get()
                .uri("/item/"+uuid).retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {}).block();
        Boolean enriched = solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("fl", "root_pid")
                        .queryParam("q", "PID:\""+response.get("pid")+"\"")
                        .queryParam("rows","0")
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(SolrQueryWithFacetResponseDto.class)
                .block().getResponse().getNumFound() > 0;
        response.put("enriched", enriched);
        return response;
    }

    @Operation(summary = "Get a thumbnail of the publication/item")
    @GetMapping(
            value = "/{uuid}/thumb",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource thumb(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/thumb").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @Operation(summary = "Get subitems, e.g. publications in periodical")
    @GetMapping("/{uuid}/children")
    public @ResponseBody Object children(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/children").retrieve().bodyToMono(Object.class).block();
    }


    @Operation(summary = "Return a hinted words from subitems")
    @GetMapping("/{uuid}/children/search/hint")
    public @ResponseBody
    Set<String> childrenSearchHint(@PathVariable(value="uuid") String uuid, @RequestParam String q, @RequestParam(required = false) NameTagEntityType nameTagType) throws SolrServerException, IOException {
        if (nameTagType != null) {
            SolrQuery query = new SolrQuery();
            query.setQuery("*:*")
                    .setFacet(true)
                    .setFacetLimit(20)
                    .setFacetMinCount(1);
            Arrays.stream(nameTagType.getSolrField().split(",")).forEach(query::addFacetField);
            query.setParam("facet.contains", q)
                    .setParam("facet.contains.ignoreCase", "true")
                    .setFilterQueries("root_pid:\""+uuid+"\" AND fedora.model:page");
            QueryResponse response = solr.query(query);
            return Arrays.stream(nameTagType.getSolrField().split(","))
                    .map(f -> response.getFacetField(f)
                            .getValues()
                            .stream()
                            .map(FacetField.Count::getName)
                            .collect(Collectors.toList()))
                    .flatMap(Collection::stream)
                    .distinct()
                    .sorted(String.CASE_INSENSITIVE_ORDER)
                    .limit(20)
                    .collect(Collectors.toCollection(() -> new TreeSet<>(String.CASE_INSENSITIVE_ORDER)));
        }

        SolrQueryWithHighlightResponseDto highlighting = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("q", "parent_pid:\""+uuid+"\" AND text_ocr:"+q.replaceAll("\"","\\\\\"")+"*")
                        .queryParam("hl", "true")
                        .queryParam("fl","PID")
                        .queryParam("hl.fl","text_ocr")
                        .queryParam("hl.fragsize","1")
                        .queryParam("hl.snippets","10")
                        .queryParam("hl.simple.pre",">>")
                        .queryParam("hl.simple.post","<<")
                        .queryParam("rows","20")
                        .queryParam("wt","json")
                        .build()).retrieve().bodyToMono(SolrQueryWithHighlightResponseDto.class).block();

        Set<String> result = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        highlighting.getHighlighting().values()
                .forEach(v -> v.getText_ocr()
                        .stream()
                        .map(s -> {
                            s = s.substring(s.indexOf(">>") + 2);
                            s = s.substring(0, s.indexOf("<<"));
                            return s;
                        })
                        .forEach(result::add));
        return result;
    }

    @Operation(summary = "Search in subitems")
    @GetMapping("/{uuid}/children/search")
    public @ResponseBody Map<String, ChildSearchDto> childrenSearch(@PathVariable(value="uuid") String uuid, @RequestParam String q) throws SolrServerException, IOException {
        Map<String, ChildSearchDto> result = new HashMap<>();
        if (q.isEmpty()) {
            return result;
        }

        SolrQueryWithHighlightResponseDto highlighting = kramerius.get()
            .uri("/search", uriBuilder -> uriBuilder
                    .queryParam("q", "parent_pid:\""+uuid+"\" AND text_ocr:"+q.replaceAll("\"","\\\\\"")+"*")
                    .queryParam("hl", "true")
                    .queryParam("fl","PID")
                    .queryParam("hl.fl","text_ocr")
                    .queryParam("hl.fragsize","120")
                    .queryParam("hl.snippets","10")
                    .queryParam("hl.simple.pre","<strong>")
                    .queryParam("hl.simple.post","</strong>")
                    .queryParam("rows","300")
                    .queryParam("wt","json")
                    .build()).retrieve().bodyToMono(SolrQueryWithHighlightResponseDto.class).block();
        highlighting.getHighlighting().forEach((k,v) -> result.put(k, new ChildSearchDto(v.getText_ocr(), null)));

        SolrQuery query = new SolrQuery();
        query.setQuery(Arrays.stream(NameTagEntityType.ALL.getSolrField().split(","))
                        .map(v -> v+":\""+q.replaceAll("\"","\\\\\"")+"\"")
                        .collect(Collectors.joining(" OR ")))
                .setFields("PID")
                .setParam("hl.fl", "nameTag.*")
                .setHighlight(true)
                .setHighlightSimplePre("")
                .setHighlightSimplePost("")
                .setRows(300);
        QueryResponse response = solr.query(query);
        response.getHighlighting().forEach((dUuid, v) -> {
            ChildSearchDto childSearchDto = result.getOrDefault(dUuid, new ChildSearchDto());
            Map<String, List<String>> values = new TreeMap<>();
            v.forEach((field, l) -> values.put(NameTagEntityType.fromSolrField(field).name(), l));
            childSearchDto.setNameTag(values);
            result.put(dUuid, childSearchDto);
        });
        return result;
    }

    @Operation(summary = "Get list of available stream of data for a publication/item, e.g. FOXML, SOLR entry, SOLR_PLUS")
    @GetMapping("/{uuid}/streams")
    public @ResponseBody Map<String, StreamDto> streams(@PathVariable(value="uuid") String uuid) {
        Map<String, StreamDto> streams =  kramerius.get()
                .uri("/item/"+uuid+"/streams").retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, StreamDto>>() {}).block();
        streams.put("SOLR", new StreamDto("Solr document from Kramerius.", "application/json"));
        if (searchService.areEnriched(Set.of(uuid))) {
            streams.put("SOLR_PLUS", new StreamDto("Solr document from Kramerius+.", "application/json"));
        }
        if (hasDocumentFoxml(uuid)) {
            streams.put("FOXML", new StreamDto("FOXML content of the document.", "application/xml"));
        }
        return streams;
    }

    /**
     * Check if the document has FOXML stream
     * @param uuid document id
     * @return true if document has FOXML
     */
    private boolean hasDocumentFoxml(String uuid) {
        try {
            return Objects.requireNonNull(kramerius.get().uri("/item/" + uuid + "/foxml").retrieve()
                    .toBodilessEntity().block()).getStatusCodeValue() == 200;
        }
        catch (NullPointerException ex) {
            return false;
        }
    }

    @Operation(summary = "Download a stream of data from the publication/item")
    @GetMapping("/{uuid}/streams/{stream}")
    public @ResponseBody ResponseEntity<ByteArrayResource> streamMods(@PathVariable(value="uuid") String uuid, @PathVariable(value="stream") String stream) {
        // Base url for streams
        String url = "/item/"+uuid+"/streams/"+stream;

        // If FOXML is requested, change the url
        if (stream.equals("FOXML")) {
            url = "/item/"+uuid+"/foxml";
        }

        // If SOLR or SOLR_PLUS is requested, make a query to Kramerius Solr or Feeder Solr
        if (stream.equals("SOLR") || stream.equals("SOLR_PLUS")) {
            WebClient client = stream.equals("SOLR") ? kramerius : solrWebClient;
            url = stream.equals("SOLR") ? "/search?q=PID:\"" + uuid + "\"" : "/select?q=PID:\"" + uuid + "\"";
            try {
                SolrQueryResponseDto solrResponse = Objects.requireNonNull(client.get()
                        .uri(url)
                        .acceptCharset(StandardCharsets.UTF_8)
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(SolrQueryResponseDto.class).block());
                Map<String, Object> document = solrResponse.getResponse().getDocs().stream().findFirst().orElseThrow();
                return ResponseEntity
                        .ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(new ByteArrayResource(objectMapper.writeValueAsBytes(document)));
            }
            catch (Exception ex) {
                return ResponseEntity.notFound().build();
            }
        }

        // Get the stream
        ResponseEntity<ByteArrayResource> entity = kramerius.get().uri(url).retrieve().toEntity(ByteArrayResource.class).block();
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource body = entity.getBody();

        // Get correct media type
        MediaType mediaType = MediaType.TEXT_PLAIN;
        try {
            if (entity.getHeaders().getContentType() != null) {
                mediaType = entity.getHeaders().getContentType();
            }
        }
        catch (Exception ex) {
            // OK
        }
        return ResponseEntity.ok().contentType(mediaType).body(body);
    }
}
