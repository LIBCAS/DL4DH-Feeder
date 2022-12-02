package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.PublicationDto;
import cz.inqool.dl4dh.feeder.exception.AccessDeniedException;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.kramerius.dto.ExportRequestDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.JobDto;
import cz.inqool.dl4dh.feeder.dto.KrameriusPlusExportDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.KrameriusItemDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.ScheduledJobEventDto;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/exports")
public class ExportApi {

    private static final Logger log = LoggerFactory.getLogger(ExportApi.class);

    private WebClient kramerius;

    private WebClient krameriusPlus;

    private final ExportRepository exportRepository;

    public ExportApi(ExportRepository exportRepository) {
        this.exportRepository = exportRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/download/{id}", produces="application/zip")
    public byte[] download(@PathVariable Long id, Principal user) {
        Export export = exportRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!export.getUsername().equals(user.getName())) {
            throw new AccessDeniedException();
        }
        // TODO check other roles

        if (export.getExportId() == null) {
            if (!export.getStatus().equals(Export.Status.COMPLETED)) {
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

        return krameriusPlus.get()
                .uri("/files/"+export.getExportId()).retrieve().bodyToMono(ByteArrayResource.class).block().getByteArray();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public Page<Export> getAll(Principal user, @ParameterObject @PageableDefault(sort = "created", direction = Sort.Direction.DESC) Pageable p) {
        Page<Export> exports = exportRepository.findByUsername(user.getName(), p);
        exports.forEach(export -> {
            if (!export.getStatus().equals(Export.Status.COMPLETED)) {
                ExportRequestDto exportRequest = krameriusPlus.get()
                        .uri("/exports/"+export.getJobId()).retrieve().bodyToMono(ExportRequestDto.class).block();
                JobDto job = exportRequest.getJobPlan().getScheduledJobEvents().stream().filter(f -> f.getJobEvent().getPublicationId() != null).findFirst().orElseThrow().getJobEvent();
                export.setStatus(job.getLastExecutionStatus());
            }
        });
        exportRepository.saveAll(exports);
        return exports;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/generate/{format}")
    public Export create(@PathVariable(value="format") String format, @RequestBody String body, @RequestParam(required = false) String name, Principal user) {
        ExportRequestDto exportRequest = krameriusPlus.post()
                .uri("/exports/"+format).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).bodyValue(body).retrieve().onStatus(HttpStatus::isError, res -> {
                    res.toEntity(String.class).subscribe(
                            entity -> log.warn("Client error {}", entity)
                    );
                    return Mono.error(new HttpClientErrorException(res.statusCode()));
                }).bodyToMono(ExportRequestDto.class).block();

        JobDto job = exportRequest.getJobPlan().getScheduledJobEvents().stream().filter(f -> f.getJobEvent().getPublicationId() != null).findFirst().orElseThrow().getJobEvent();
        String publicationId = job.getPublicationId();
        KrameriusItemDto publication = kramerius.get()
                .uri("/item/"+publicationId).retrieve().bodyToMono(KrameriusItemDto.class).block();

        Export export = new Export();
        export.setJobId(exportRequest.getId());
        export.setPublicationId(publicationId);
        export.setPublicationTitle(name != null ? name : publication.getTitle());
        export.setCreated(job.getCreated());
        export.setStatus(job.getLastExecutionStatus());
        export.setDelimiter(job.getConfig().getParameters().getDelimiter());
        export.setFormat(Export.Format.valueOf(format.toUpperCase()));
        export.setParameters(job.getConfig().getParameters().getParams());
        export.setTeiParameters(job.getConfig().getParameters().getTeiExportParams());
        export.setUsername(user.getName());
        exportRepository.save(export);

        return export;
    }
    @Resource(name = "krameriusWebClient")
    public void setKrameriusWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setKrameriusPlusWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
