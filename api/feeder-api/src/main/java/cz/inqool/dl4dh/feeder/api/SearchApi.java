package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.CollectionDto;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.repository.FilterRepository;
import cz.inqool.dl4dh.feeder.service.SearchService;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final FilterRepository filterRepository;
    private final SearchService searchService;

    public SearchApi(FilterRepository filterRepository, SearchService searchService) {
        this.filterRepository = filterRepository;
        this.searchService = searchService;
    }

    @PostMapping(value = "/hint", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> hint(@RequestParam String q, @RequestParam(required = false) NameTagEntityType nameTagType) {
        return searchService.hint(q, nameTagType);
    }

    @PostMapping(value = "")
    public SearchDto search(@RequestBody Filter filters, @RequestParam(required = false, defaultValue = "false") boolean save, Principal user) {
        // Save a query if it is requested
        if (save && user != null) {
            searchService.saveSearch(filters, user.getName());
        }

        return searchService.search(filters);
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

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/history")
    public Page<Filter> getAll(Principal user, @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable p) {
        return filterRepository.findByUsername(user.getName(), p);
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
