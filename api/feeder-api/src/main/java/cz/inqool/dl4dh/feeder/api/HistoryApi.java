package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.exception.AccessDeniedException;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.model.Filter;
import cz.inqool.dl4dh.feeder.repository.FilterRepository;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/search/history")
public class HistoryApi {

    private final FilterRepository filterRepository;

    public HistoryApi(FilterRepository filterRepository) {
        this.filterRepository = filterRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping()
    public Page<Filter> getAll(Principal user, @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable p) {
        return filterRepository.findByUsername(user.getName(), p);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/{id}")
    public Filter getById(Principal user, @PathVariable Long id) {
        Filter filter = filterRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!filter.getUsername().equals(user.getName())) {
            throw new AccessDeniedException();
        }
        return filter;
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping(value = "/{id}")
    public void deleteById(Principal user, @PathVariable Long id) {
        Filter filter = filterRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!filter.getUsername().equals(user.getName())) {
            throw new AccessDeniedException();
        }
        filterRepository.delete(filter);
    }
}
