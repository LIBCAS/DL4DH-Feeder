package cz.inqool.dl4dh.feeder.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.dto.ChildSearchDto;
import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryWithHighlightResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryWithFacetResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.StreamDto;
import cz.inqool.dl4dh.feeder.service.Kramerius5SolrFieldsServiceImpl;
import cz.inqool.dl4dh.feeder.service.KrameriusSolrFieldsService;
import cz.inqool.dl4dh.feeder.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.beans.factory.annotation.Qualifier;
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

    public static final String K5_STREAM_IMG_PREVIEW = "IMG_PREVIEW";
    public static final String K5_STREAM_IMG_THUMB = "IMG_THUMB";
    public static final String K5_STREAM_IMG_FULL = "IMG_FULL";
    public static final String K5_STREAM_BIBLIO_MODS = "BIBLIO_MODS";
    public static final String K5_STREAM_DC = "DC";
    public static final String K5_STREAM_TEXT_OCR = "TEXT_OCR";
    public static final String K5_STREAM_ALTO = "ALTO";
    public static final String K5_STREAM_SOLR = "SOLR";
    public static final String K5_STREAM_SOLR_PLUS = "SOLR_PLUS";
    public static final String K5_STREAM_FOXML = "FOXML";
    private WebClient kramerius;
    private WebClient iiif;
    private WebClient solrWebClient;
    private final InfoDto info;
    private final List<String> publicPolicies;

    private final HttpSolrClient solr;
    private final SearchService searchService;

    private final ObjectMapper objectMapper;

    private final KrameriusSolrFieldsService solrFields;
    private final KrameriusSolrFieldsService feederSolrFields = new Kramerius5SolrFieldsServiceImpl();

    public ItemApi(InfoDto info, @Value("${solr.host.query}") String solrHost, @Value("${system.kramerius.publicPolicies}") String publicPolicies, SearchService searchService, ObjectMapper objectMapper, @Qualifier("krameriusSolrFields") KrameriusSolrFieldsService solrFields) {
        this.info = info;
        this.publicPolicies = List.of(publicPolicies.split(","));;
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
        this.searchService = searchService;
        this.objectMapper = objectMapper;
        this.solrFields = solrFields;
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "krameriusIIIFClient")
    public void setIIIFClient(WebClient webClient) {
        this.iiif = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }

    @Operation(summary = "Get a publication/item")
    @GetMapping("/{uuid}")
    public @ResponseBody Map<String, Object> item(@PathVariable(value="uuid") String uuid) {
        Map<String, Object> response = new HashMap<>();
        if (info.isVersion7()) {
            SolrQueryResponseDto res = kramerius.get()
                    .uri("/search", uriBuilder -> uriBuilder
                                    .queryParam("fl", String.join(",",solrFields.pid(), solrFields.rootPid(), solrFields.model(), solrFields.title(), solrFields.rootTitle(), solrFields.licenses(), "has_tiles"))
                                    .queryParam("q", solrFields.pid()+":\""+uuid+"\"")
                                    .queryParam("rows","1").build()
                    ).retrieve().bodyToMono(SolrQueryResponseDto.class).block();
            if (res != null) {
                response = res.getResponse().getDocs().stream().findFirst().orElseGet(HashMap::new);
            }
            if (response.containsKey(solrFields.rootPid())) {
                response.put(feederSolrFields.rootPid(), response.get(solrFields.rootPid()));
                response.remove(solrFields.rootPid());
            }
            if (response.containsKey(solrFields.model()) && !solrFields.model().equals("model")) {
                response.put("model", response.get(solrFields.model()));
                response.remove(solrFields.model());
            }
            if (response.containsKey(solrFields.title())) {
                response.put("title", response.get(solrFields.title()));
                response.remove(solrFields.title());
            }
            if (response.containsKey(solrFields.rootTitle())) {
                response.put(feederSolrFields.rootTitle(), response.get(solrFields.rootTitle()));
                response.remove(solrFields.rootTitle());
            }
            if (response.containsKey(solrFields.licenses())) {
                if (response.get(solrFields.licenses()) instanceof List && !((List<?>) response.get(solrFields.licenses())).isEmpty()) {
                    response.put("policy", ((List<?>)response.get(solrFields.licenses())).stream().anyMatch(publicPolicies::contains) ? "public" : "private");
                }
                response.remove(solrFields.licenses());
            }

            Map<String, Object> info = kramerius.get().uri("/items/"+uuid+"/info")
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {}).block();
            if (info != null && info.containsKey("image") && info.get("image") instanceof Map){
                Map<String, String> imageInfo = (Map<String, String>) info.get("image");
                if (imageInfo.containsKey("type")){
                    response.put("type", imageInfo.get("type"));
                }
            }

            List<Map<String, Object>> contexts = new ArrayList<>();
            Map<String, Object> context = new HashMap<>();
            context.put("pid", response.get("pid"));
            context.put("model", response.get("model"));
            contexts.add(context);
            response.put("context", contexts);
        }
        else {
            response =  kramerius.get()
                    .uri("/item/"+uuid).retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {}).block();
            response.put("has_tiles", "true");
        }
        Map<String, Object> finalResponse = response;
        Boolean enriched = solrWebClient.get()
                .uri("/select", uriBuilder -> uriBuilder
                        .queryParam("fl", feederSolrFields.rootPid())
                        .queryParam("q", feederSolrFields.pid()+":\""+ finalResponse.get("pid")+"\"")
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
                .uri(info.isVersion7() ? "/items/"+uuid+"/image/thumb" : "/item/"+uuid+"/thumb").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @Operation(summary = "Get a basic info of the publication/item")
    @GetMapping("/{uuid}/info")
    public @ResponseBody Object info(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/items/"+uuid+"/info").retrieve().bodyToMono(Object.class).block();
    }


    @Operation(summary = "Get IIIF info")
    @GetMapping("/{uuid}/iiif")
    public @ResponseBody Object iiif(@PathVariable(value="uuid") String uuid) {
        return iiif.get()
                .uri("/"+uuid+"/info.json").retrieve().bodyToMono(Object.class).block();
    }

    @Operation(summary = "Get an image of the publication/item")
    @GetMapping(
            value = "/{uuid}/image",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource image(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri(info.isVersion7() ? "/items/"+uuid+"/image" : "/item/"+uuid+"/thumb").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @Operation(summary = "Get subitems, e.g. publications in periodical")
    @GetMapping("/{uuid}/children")
    public @ResponseBody Object children(@PathVariable(value="uuid") String uuid) {
        if (info.isVersion7()) {
            // Do not return children if publication is type of PDF (workaround to do not show PDF)
            Map<String, Object> info = kramerius.get().uri("/items/"+uuid+"/info")
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {}).block();
            if (info != null && info.containsKey("image") && info.get("image") instanceof Map){
                Map<String, String> imageInfo = (Map<String, String>) info.get("image");
                if (imageInfo.containsKey("type") && imageInfo.get("type").equals("application/pdf")){
                    return new ArrayList<>();
                }
            }

            SolrQueryResponseDto res = kramerius.get()
                    .uri("/search", uriBuilder -> uriBuilder
                            .queryParam("fl", String.join(",",solrFields.pid(), solrFields.rootPid(), solrFields.model(), solrFields.title(), solrFields.rootTitle(), solrFields.date(), solrFields.licenses(), "part.number.str"))
                            .queryParam("q", "own_parent.pid:"+uuid.replaceAll(":", "\\\\:"))
                            .queryParam("sort", "rels_ext_index.sort asc")
                            .queryParam("rows","10000").build()
                    ).retrieve().bodyToMono(SolrQueryResponseDto.class).block();
            return res.getResponse().getDocs().stream().map(obj -> {

                // Add a detail field with year and volumeNumber
                Map<String, Object> details = new HashMap<>();
                Map<String, String> detailMap = Map.of(
                        "volumeNumber", "part.number.str",
                        "year", solrFields.date()
                );
                detailMap.forEach((k,v) -> {
                    if (obj.containsKey(v)) {
                        details.put(k, obj.get(v));
                        obj.remove(v);
                    }
                });
                obj.put("details", details);

                // Rename some fields
                Map<String, String> map = Map.of(
                        "title", solrFields.title(),
                        "root_title", solrFields.rootTitle(),
                        "root_pid", solrFields.rootPid()
                );
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    if (obj.containsKey(entry.getValue())) {
                        obj.put(entry.getKey(), obj.get(entry.getValue()));
                        obj.remove(entry.getValue());
                    }
                }

                // Modify licences to policy
                obj.put("policy", !obj.containsKey(solrFields.licenses()) || Collections.disjoint((Collection<?>)obj.get(solrFields.licenses()), publicPolicies) ? "private" : "public");
                if (obj.containsKey(solrFields.licenses())) {
                    obj.remove(solrFields.licenses());
                }

                // Add info about datanode
                obj.put("datanode", obj.getOrDefault(solrFields.model(), "").equals("page"));
                return obj;
            }).collect(Collectors.toList());
        }
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
                    .setFilterQueries(feederSolrFields.rootPid()+":\""+uuid+"\" AND "+feederSolrFields.model()+":page");
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
                        .queryParam("q", solrFields.textOcr()+":"+q.replaceAll("\"","\\\\\"").toLowerCase()+"*")
                        .queryParam("fq", solrFields.parentPid()+":\""+uuid+"\"")
                        .queryParam("hl", "true")
                        .queryParam("fl",solrFields.pid())
                        .queryParam("hl.fl",solrFields.textOcr())
                        .queryParam("hl.fragsize","1")
                        .queryParam("hl.snippets","10")
                        .queryParam("hl.simple.pre",">>")
                        .queryParam("hl.simple.post","<<")
                        .queryParam("rows","20")
                        .queryParam("wt","json")
                        .build()).retrieve().bodyToMono(SolrQueryWithHighlightResponseDto.class).block();

        Set<String> result = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        highlighting.getHighlighting().values()
                .forEach(v -> {
                    if (v.getText_ocr() != null) {
                        v.getText_ocr().stream()
                                .map(s -> {
                                    s = s.substring(s.indexOf(">>") + 2);
                                    s = s.substring(0, s.indexOf("<<"));
                                    return s.toLowerCase();
                                })
                                .forEach(result::add);
                    }
                });
        return result;
    }

    @Operation(summary = "Search in subitems")
    @GetMapping("/{uuid}/children/search")
    public @ResponseBody Map<String, ChildSearchDto> childrenSearch(@PathVariable(value="uuid") String uuid, @RequestParam String q) throws SolrServerException, IOException {
        Map<String, ChildSearchDto> result = new HashMap<>();
        if (q.isEmpty()) {
            return result;
        }

        Map<String, String> urlParams = new HashMap<>();
        urlParams.put("edismax", "{!edismax qf='text_ocr' v=$q1}");
        SolrQueryWithHighlightResponseDto highlighting = kramerius.get()
            .uri("/search", uriBuilder -> uriBuilder
                    .queryParam("q", "_query_:\"{edismax}\"")
                    .queryParam("q1", q)
                    .queryParam("fq", "(own_parent.pid:\""+uuid+"\") AND model:page")
                    .queryParam("hl", "true")
                    .queryParam("fl",solrFields.pid())
                    .queryParam("hl.fl",solrFields.textOcr())
                    .queryParam("hl.fragsize","40")
                    .queryParam("hl.snippets","2")
                    .queryParam("hl.simple.pre","<strong>")
                    .queryParam("hl.simple.post","</strong>")
                    .queryParam("rows","300")
                    .queryParam("wt","json")
                    .build(urlParams)).retrieve().bodyToMono(SolrQueryWithHighlightResponseDto.class).block();
        highlighting.getHighlighting().forEach((k,v) -> result.put(k.replace(uuid+"!",""), new ChildSearchDto(v.getText_ocr(), null)));

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
        Map<String, StreamDto> streams;
        if (info.isVersion7()) {
            Map<String, Map<String, Boolean>> infoData =  kramerius.get()
                    .uri("/items/"+uuid+"/info/data").retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Map<String, Boolean>>>() {}).block();

            streams = new HashMap<>();
            Map<String, Boolean> imageInfo = infoData.getOrDefault("image", new HashMap<>());
            if (imageInfo.getOrDefault("preview", false)) {
                streams.put(K5_STREAM_IMG_PREVIEW, new StreamDto("", "image/jpeg"));
            }
            if (imageInfo.getOrDefault("thumb", false)) {
                streams.put(K5_STREAM_IMG_THUMB, new StreamDto("", "image/jpeg"));
            }
            if (imageInfo.getOrDefault("full", false)) {
                streams.put(K5_STREAM_IMG_FULL, new StreamDto("", "image/jpeg"));
            }

            Map<String, Boolean> metadataInfo = infoData.getOrDefault("metadata", new HashMap<>());
            if (metadataInfo.getOrDefault("mods", false)) {
                streams.put(K5_STREAM_BIBLIO_MODS, new StreamDto("", "text/xml"));
            }
            if (metadataInfo.getOrDefault("dc", false)) {
                streams.put(K5_STREAM_DC, new StreamDto("Dublin Core Record for this object", "text/xml"));
            }

            Map<String, Boolean> ocrInfo = infoData.getOrDefault("ocr", new HashMap<>());
            if (ocrInfo.getOrDefault("text", false)) {
                streams.put(K5_STREAM_TEXT_OCR, new StreamDto("", "text/plain"));
            }
            if (ocrInfo.getOrDefault("alto", false)) {
                streams.put(K5_STREAM_ALTO, new StreamDto("", "text/plain"));
            }
        }
        else {
            streams =  kramerius.get()
                    .uri("/item/"+uuid+"/streams").retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, StreamDto>>() {}).block();
            streams.put(K5_STREAM_SOLR, new StreamDto("Solr document from Kramerius.", "application/json"));
            if (searchService.areEnriched(Set.of(uuid))) {
                streams.put(K5_STREAM_SOLR_PLUS, new StreamDto("Solr document from Kramerius+.", "application/json"));
            }
            if (hasDocumentFoxml(uuid)) {
                streams.put(K5_STREAM_FOXML, new StreamDto("FOXML content of the document.", "application/xml"));
            }
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
        if (stream.equals(K5_STREAM_FOXML)) {
            url = "/item/"+uuid+"/foxml";
        }

        // If FOXML is requested, change the url
        if (info.isVersion7()) {
            switch (stream) {
                case K5_STREAM_BIBLIO_MODS:
                    url = "/items/"+uuid+"/metadata/mods";
                    break;
                case K5_STREAM_DC:
                    url = "/items/"+uuid+"/metadata/dc";
                    break;
                case K5_STREAM_TEXT_OCR:
                    url = "/items/"+uuid+"/ocr/text";
                    break;
                case K5_STREAM_ALTO:
                    url = "/items/"+uuid+"/ocr/alto";
                    break;
                case K5_STREAM_IMG_FULL:
                    url = "/items/"+uuid+"/image";
                    break;
                case K5_STREAM_IMG_THUMB:
                    url = "/items/"+uuid+"/image/thumb";
                    break;
                case K5_STREAM_IMG_PREVIEW:
                    url = "/items/"+uuid+"/image/preview";
                    break;
            }
        }

        // If SOLR or SOLR_PLUS is requested, make a query to Kramerius Solr or Feeder Solr
        if (stream.equals(K5_STREAM_SOLR) || stream.equals(K5_STREAM_SOLR_PLUS)) {
            WebClient client = stream.equals(K5_STREAM_SOLR) ? kramerius : solrWebClient;
            url = stream.equals(K5_STREAM_SOLR) ? "/search?q="+solrFields.pid()+":\"" + uuid + "\"" : "/select?q="+solrFields.pid()+":\"" + uuid + "\"";
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
