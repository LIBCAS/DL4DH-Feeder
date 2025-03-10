package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.dto.kramerius.CollectionDto;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
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

    private final SearchService searchService;
    private WebClient kramerius;
    private WebClient krameriusPrint;

    public SearchApi(SearchService searchService) {
        this.searchService = searchService;
    }

    @Operation(summary = "Hinting words for a search query")
    @PostMapping(value = "/hint", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> hint(@RequestParam @Schema(description = "Query string") String q, @RequestParam(required = false) NameTagEntityType nameTagType) {
        return searchService.hint(q, nameTagType);
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody Filter filters, @RequestParam(required = false, defaultValue = "false") @Schema(description = "Save the search query to user's history", defaultValue = "false", type = "boolean") boolean save, Principal user) {
        SearchDto results = searchService.search(filters);

        // Save a query if it is requested
        if (save && user != null) {
            filters.setNumFound(results.getDocuments().getNumFound());
            searchService.saveSearch(filters, user.getName());
        }

        return results;
    }

    @Operation(summary = "Get list of collections in the system")
    @GetMapping(value = "/collections")
    public @ResponseBody List<CollectionDto> collections() {
        return kramerius.get().uri("/vc").retrieve().bodyToMono(new ParameterizedTypeReference<List<CollectionDto>>() {
        }).block();
    }

    @Operation(summary = "Download a pds of publictions")
    @GetMapping(value = "/localPrintPDF", produces = "application/pdf")
    public @ResponseBody ByteArrayResource print(@RequestParam @Schema(example = "uuid:677e4670-694b-11e4-8c6e-001018b5eb5c,uuid:6793a330-694b-11e4-8c6e-001018b5eb5c") String pids, @RequestParam @Schema(defaultValue = "A4") Optional<String> pagesize, @RequestParam @Schema(defaultValue = "FULL") Optional<String> imgop) {
        return krameriusPrint.get().uri(uriBuilder -> uriBuilder.queryParam("pids", pids)
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
