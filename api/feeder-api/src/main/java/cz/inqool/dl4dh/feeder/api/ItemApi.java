package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.ChildSearchDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrHighlightDto;
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

    public ItemApi(@Value("${solr.host.query}") String solrHost) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "solrWebClient")
    public void setSolrWebClient(WebClient webClient) {
        this.solrWebClient = webClient;
    }

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

    @GetMapping(
            value = "/{uuid}/thumb",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody ByteArrayResource thumb(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/thumb").retrieve().bodyToMono(ByteArrayResource.class).block();
    }

    @GetMapping("/{uuid}/children")
    public @ResponseBody Object children(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/children").retrieve().bodyToMono(Object.class).block();
    }


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

        SolrHighlightDto highlighting = kramerius.get()
                .uri("/search", uriBuilder -> uriBuilder
                        .queryParam("q", "parent_pid:\""+uuid+"\" AND text_ocr:"+q.replaceAll("\"","\\\\\"")+"*")
                        .queryParam("hl", "true")
                        .queryParam("fl","PID")
                        .queryParam("wt","json")
                        .queryParam("hl.fl","text_ocr")
                        .queryParam("hl.fragsize","1")
                        .queryParam("hl.snippets","10")
                        .queryParam("hl.simple.pre",">>")
                        .queryParam("hl.simple.post","<<")
                        .queryParam("rows","20")
                        .build()).retrieve().bodyToMono(SolrHighlightDto.class).block();

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

    @GetMapping("/{uuid}/children/search")
    public @ResponseBody Map<String, ChildSearchDto> childrenSearch(@PathVariable(value="uuid") String uuid, @RequestParam String q) {
        SolrHighlightDto highlighting = kramerius.get()
            .uri("/search", uriBuilder -> uriBuilder
                    .queryParam("q", "parent_pid:\""+uuid+"\" AND text_ocr:"+q.replaceAll("\"","\\\\\"")+"*")
                    .queryParam("hl", "true")
                    .queryParam("fl","PID")
                    .queryParam("wt","json")
                    .queryParam("hl.fl","text_ocr")
                    .queryParam("hl.fragsize","120")
                    .queryParam("hl.snippets","10")
                    .queryParam("hl.simple.pre","<strong>")
                    .queryParam("hl.simple.post","</strong>")
                    .queryParam("rows","20")
                    .build()).retrieve().bodyToMono(SolrHighlightDto.class).block();

        Map<String, ChildSearchDto> result = new HashMap<>();
        highlighting.getHighlighting().forEach((k,v) -> result.put(k, new ChildSearchDto(v.getText_ocr().stream()
                .map(s -> {
                    s = s.substring(s.indexOf(">>") + 2);
                    s = s.substring(0, s.indexOf("<<"));
                    return s;
                }).collect(Collectors.toList()), new HashMap<>())));
        return result;
    }

    @GetMapping("/{uuid}/streams")
    public @ResponseBody Object streams(@PathVariable(value="uuid") String uuid) {
        return kramerius.get()
                .uri("/item/"+uuid+"/streams").retrieve().bodyToMono(Object.class).block();
    }

    @GetMapping("/{uuid}/streams/{stream}")
    public @ResponseBody ByteArrayResource streamMods(@PathVariable(value="uuid") String uuid, @PathVariable(value="stream") String stream) {
        return kramerius.get()
                .uri("/item/"+uuid+"/streams/"+stream).retrieve().bodyToMono(ByteArrayResource.class).block();
    }
}
