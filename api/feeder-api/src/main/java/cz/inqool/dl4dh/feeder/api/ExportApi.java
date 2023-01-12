package cz.inqool.dl4dh.feeder.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.exception.AccessDeniedException;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.kramerius.dto.ExportRequestDto;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.repository.ExportRepository;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.annotation.Resource;
import java.security.Principal;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/exports")
public class ExportApi {

    private static final Logger log = LoggerFactory.getLogger(ExportApi.class);

    private WebClient krameriusPlus;

    private final ExportRepository exportRepository;

    private final ObjectMapper objectMapper;

    public ExportApi(ExportRepository exportRepository, ObjectMapper objectMapper) {
        this.exportRepository = exportRepository;
        this.objectMapper = objectMapper;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/download/{id}", produces="application/zip")
    public ResponseEntity<byte[]> download(@PathVariable Long id, Principal user) {
        Export export = exportRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!export.getUsername().equals(user.getName())) {
            throw new AccessDeniedException();
        }
        // TODO check other roles

        if (export.getExportId() == null) {
            if (!export.isFinished()) {
                throw new ResourceNotFoundException();
            }
            ExportRequestDto exportDto = krameriusPlus.get()
                    .uri("/exports/"+export.getJobId()).retrieve().onStatus(HttpStatus::isError, res -> {
                        res.toEntity(String.class).subscribe(
                                entity -> log.warn("Client error {}", entity)
                        );
                        return Mono.error(new HttpClientErrorException(res.statusCode()));
                    }).bodyToMono(ExportRequestDto.class).block();
            export.setExportId(exportDto.getBulkExport().getFileRef().getId());
            exportRepository.save(export);
        }

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set(HttpHeaders.CONTENT_DISPOSITION,
                String.format("attachment; filename=\"%1$s.zip\"", export.getPublicationTitle()));

        return new ResponseEntity<>(
                krameriusPlus.get()
                        .uri("/files/"+export.getExportId())
                        .retrieve()
                        .bodyToMono(ByteArrayResource.class).block()
                        .getByteArray(),
                responseHeaders,
                HttpStatus.OK
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public Page<Export> getAll(Principal user, @ParameterObject @PageableDefault(sort = "created", direction = Sort.Direction.DESC) Pageable p) {
        Page<Export> exports = exportRepository.findByUsername(user.getName(), p);
        exports.forEach(export -> {
            if (!export.getStatus().equals(Export.Status.COMPLETED) && !export.getStatus().equals(Export.Status.FAILED)) {
                ExportRequestDto exportRequest = krameriusPlus.get()
                        .uri("/exports/"+export.getJobId()).retrieve().bodyToMono(ExportRequestDto.class).block();
                export.setStatus(exportRequest.getState());
            }
        });
        exportRepository.saveAll(exports);
        return exports;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/generate")
    public Export create(@RequestBody String body, @RequestParam(required = false) String name, Principal user) throws JsonProcessingException {
        ExportRequestDto exportRequest = krameriusPlus.post()
                .uri("/exports/export").header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).bodyValue(body).retrieve().onStatus(HttpStatus::isError, res -> {
                    res.toEntity(String.class).subscribe(
                            entity -> log.warn("Client error {}", entity)
                    );
                    return Mono.error(new HttpClientErrorException(res.statusCode()));
                }).bodyToMono(ExportRequestDto.class).block();

        Export export = new Export();
        export.setJobId(exportRequest.getId());
        export.setPublicationIds(exportRequest.getPublicationIds());
        export.setPublicationTitle(name != null && !name.isEmpty() ? name : "?"); // TODO do not allow empty name
        export.setCreated(exportRequest.getCreated());
        export.setStatus(exportRequest.getState());
        export.setDelimiter(exportRequest.getConfig().getDelimiter());
        export.setFormat(exportRequest.getConfig().getExportFormat());
        if (exportRequest.getConfig().getParams() != null) {
            export.setParameters(objectMapper.writeValueAsString(exportRequest.getConfig().getParams()));
        }
        if (exportRequest.getConfig().getTeiParams() != null) {
            export.setTeiParameters(objectMapper.writeValueAsString(exportRequest.getConfig().getTeiParams()));
        }
        export.setUsername(user.getName());
        exportRepository.save(export);

        return export;
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setKrameriusPlusWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
