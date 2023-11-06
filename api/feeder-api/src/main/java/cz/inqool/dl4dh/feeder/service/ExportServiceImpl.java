package cz.inqool.dl4dh.feeder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.dl4dh.feeder.api.ExportApi;
import cz.inqool.dl4dh.feeder.dto.export.ExportRequestDto;
import cz.inqool.dl4dh.feeder.dto.kramerius.KrameriusItemDto;
import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.ExportRequestCreateDto;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.model.ExportItem;
import cz.inqool.dl4dh.feeder.repository.ExportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExportServiceImpl implements ExportService {

    private static final Logger log = LoggerFactory.getLogger(ExportServiceImpl.class);
    public static final int REFRESH_MIN_INTERVAL_SECONDS = 5;

    private WebClient kramerius;

    private WebClient krameriusPlus;

    private final ExportRepository exportRepository;

    private final ObjectMapper objectMapper;

    public ExportServiceImpl(ExportRepository exportRepository, ObjectMapper objectMapper) {
        this.exportRepository = exportRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Page<Export> get(String userName, Pageable p) {
        Page<Export> exports = exportRepository.findByUsername(userName, p);
        exports.forEach(this::refreshState);
        return exports;
    }

    @Override
    public Export create(String userName, ExportRequestCreateDto request) {
        try {
            String body = objectMapper.writeValueAsString(request);
            ExportRequestDto exportRequest = krameriusPlus.post()
                    .uri("/exports/export").header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).bodyValue(body).retrieve().onStatus(HttpStatus::isError, res -> {
                        res.toEntity(String.class).subscribe(
                                entity -> log.warn("Client error {}", entity)
                        );
                        return Mono.error(new HttpClientErrorException(res.statusCode()));
                    }).bodyToMono(ExportRequestDto.class).block();

            String name = request.getName();
            if (name == null || name.isEmpty()) {
                if (exportRequest.getPublicationIds().size() == 1) {
                    String publicationId = exportRequest.getPublicationIds().stream().findFirst().get();
                    KrameriusItemDto publication = kramerius.get()
                            .uri("/item/"+publicationId).retrieve().bodyToMono(KrameriusItemDto.class).block();
                    name = publication.getTitle();
                }
                else {
                    Date date = Calendar.getInstance().getTime();
                    DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd-hhmmss");
                    name = "export-"+dateFormat.format(date);
                }
            }

            Export export = new Export();
            export.setJobId(exportRequest.getId());
            export.setPublicationIds(exportRequest.getPublicationIds());
            export.setPublicationTitle(name);
            export.setCreated(java.time.Clock.systemUTC().instant().toString());
            export.setStatus(exportRequest.getBulkExport().getState());
            export.setDelimiter(exportRequest.getConfig().getDelimiter());
            export.setFormat(exportRequest.getConfig().getExportFormat());
            if (exportRequest.getConfig().getParams() != null) {
                export.setParameters(objectMapper.writeValueAsString(exportRequest.getConfig().getParams()));
            }
            if (exportRequest.getConfig().getTeiParams() != null) {
                export.setTeiParameters(objectMapper.writeValueAsString(exportRequest.getConfig().getTeiParams()));
            }
            export.setUsername(userName);
            export.setItems(exportRequest.getItems().stream().map(item -> {
                ExportItem newItem = new ExportItem();
                newItem.setId(UUID.fromString(item.getId()));
                newItem.setPublicationId(item.getPublicationId());
                newItem.setPublicationTitle(item.getPublicationTitle());
                newItem.setStatus(Export.Status.CREATED);
                return newItem;
            }).collect(Collectors.toList()));

            exportRepository.save(export);
            return export;
        }
        catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
    }

    private ResponseEntity<byte[]> downloadGeneralFile(String fileName, String fileId) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set(HttpHeaders.CONTENT_DISPOSITION,
                String.format("attachment; filename=\"%1$s.zip\"", fileName));

        return new ResponseEntity<>(
                krameriusPlus.get()
                        .uri("/files/"+fileId)
                        .retrieve()
                        .bodyToMono(ByteArrayResource.class).block()
                        .getByteArray(),
                responseHeaders,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<byte[]> download(Export export) {
        if (!export.isFinished()) {
            refreshState(export);
        }
        if (!export.isFinished()) {
            throw new ResourceNotFoundException();
        }
        return downloadGeneralFile(export.getPublicationTitle(), export.getExportId());
    }

    @Override
    public ResponseEntity<byte[]> downloadItem(ExportItem item) {
        Export export = item.getExport();
        if (!export.isFinished()) {
            refreshState(export);
        }
        if (!export.isFinished()) {
            throw new ResourceNotFoundException();
        }
        return downloadGeneralFile(item.getPublicationTitle(), item.getFileId());
    }

    @Override
    public void refreshState(Export export) {
        // Refresh only if 30 seconds elapsed from the previous refresh
        Date limitDate = new Date(System.currentTimeMillis() - REFRESH_MIN_INTERVAL_SECONDS * 1000);
        if (export.isFinished() || export.getUpdatedAt().after(limitDate)) {
            return;
        }
        ExportRequestDto exportDto = krameriusPlus.get()
                .uri("/exports/"+export.getJobId()).retrieve().onStatus(HttpStatus::isError, res -> {
                    res.toEntity(String.class).subscribe(
                            entity -> log.warn("Client error {}", entity)
                    );
                    return Mono.error(new HttpClientErrorException(res.statusCode()));
                }).bodyToMono(ExportRequestDto.class).block();
        if (exportDto == null) {
            throw new ResourceNotFoundException();
        }

        // Set main file id to export
        if (exportDto.getBulkExport() != null && exportDto.getBulkExport().getFile() != null) {
            export.setExportId(exportDto.getBulkExport().getFile().getId());
        }

        // Update state of all items
        exportDto.getItems().forEach(krameriusItem -> {
            Optional<ExportItem> optionalExportItem = export.getItems().stream().filter(i -> i.getId().equals(UUID.fromString(krameriusItem.getId()))).findFirst();
            if (optionalExportItem.isEmpty()) {
                ExportItem newItem = new ExportItem();
                newItem.setId(UUID.fromString(krameriusItem.getId()));
                newItem.setPublicationId(krameriusItem.getPublicationId());
                newItem.setPublicationTitle(krameriusItem.getPublicationTitle());
                newItem.setStatus(Export.Status.CREATED);
                newItem.setExport(export);
                export.getItems().add(newItem);
            }
            else {
                ExportItem item = optionalExportItem.get();
                if (krameriusItem.getRootExport() != null) {
                    if (krameriusItem.getRootExport().getFileRef() != null) {
                        item.setFileId(krameriusItem.getRootExport().getFileRef().getId());
                    }
                    if (krameriusItem.getRootExport().getExportJob() != null) {
                        item.setStatus(krameriusItem.getRootExport().getExportJob().getExecutionStatus());
                    }
                }
            }
        });
        export.setStatus(exportDto.getState());
        export.setUpdatedAt(new Date());
        exportRepository.save(export);
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
