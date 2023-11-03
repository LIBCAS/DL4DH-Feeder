package cz.inqool.dl4dh.feeder.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.ExportRequestCreateDto;
import cz.inqool.dl4dh.feeder.exception.AccessDeniedException;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.dto.export.ExportRequestDto;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.model.ExportItem;
import cz.inqool.dl4dh.feeder.repository.ExportItemRepository;
import cz.inqool.dl4dh.feeder.repository.ExportRepository;
import cz.inqool.dl4dh.feeder.service.ExportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.security.Principal;
import java.util.UUID;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/exports")
public class ExportApi {

    private static final Logger log = LoggerFactory.getLogger(ExportApi.class);

    private final ExportService exportService;

    private final ExportRepository exportRepository;

    private final ExportItemRepository itemRepository;

    public ExportApi(ExportService exportService, ExportRepository exportRepository, ExportItemRepository itemRepository) {
        this.exportService = exportService;
        this.exportRepository = exportRepository;
        this.itemRepository = itemRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/download/{id}", produces="application/zip")
    public ResponseEntity<byte[]> download(@PathVariable Long id, Principal user) {
        Export export = exportRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!export.getUsername().equals(user.getName())) {
            throw new AccessDeniedException();
        }
        return exportService.download(export);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/download/{id}/item/{itemId}", produces="application/zip")
    public ResponseEntity<byte[]> download(@PathVariable Long id, @PathVariable UUID itemId, Principal user) {
        ExportItem item = itemRepository.findById(itemId).orElseThrow(ResourceNotFoundException::new);
        Export export = item.getExport();
        if (export == null || !export.getUsername().equals(user.getName()) || !export.getId().equals(id)) {
            throw new AccessDeniedException();
        }
        return exportService.downloadItem(item);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public Page<Export> getAll(Principal user, @ParameterObject @PageableDefault(sort = "created", direction = Sort.Direction.DESC) Pageable p) {
        return exportService.get(user.getName(), p);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/generate")
    public Export create(@RequestBody ExportRequestCreateDto request, Principal user) {
        return exportService.create(user.getName(), request);
    }
}
