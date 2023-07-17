package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.dto.kramerius.CollectionDto;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.service.SearchService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.*;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/search")
public class SearchApi {

    private WebClient kramerius;
    private WebClient krameriusPrint;
    private final SearchService searchService;

    public SearchApi(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping(value = "/hint", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> hint(@RequestParam String q, @RequestParam(required = false) NameTagEntityType nameTagType) {
        return searchService.hint(q, nameTagType);
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody Filter filters, @RequestParam(required = false, defaultValue = "false") boolean save, Principal user) {
        SearchDto results = searchService.search(filters);

        // Save a query if it is requested
        if (save && user != null) {
            filters.setNumFound(results.getDocuments().getNumFound());
            searchService.saveSearch(filters, user.getName());
        }

        return results;
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
}
