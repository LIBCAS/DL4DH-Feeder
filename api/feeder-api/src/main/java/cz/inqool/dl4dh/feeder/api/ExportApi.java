package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.exception.AccessDeniedException;
import cz.inqool.dl4dh.feeder.exception.ResourceNotFoundException;
import cz.inqool.dl4dh.feeder.kramerius.dto.JobDto;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.repository.ExportRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.List;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/exports")
public class ExportApi {

    private WebClient krameriusPlus;

    private final ExportRepository exportRepository;

    public ExportApi(ExportRepository exportRepository) {
        this.exportRepository = exportRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/download/{id}", produces="application/zip")
    public byte[] download(@PathVariable Long id, Principal user) {
        Export export = exportRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        if (!export.getUser().equals(user.getName())){
            throw new AccessDeniedException();
        }
        // TODO check other roles

        if (export.getExportId() == null) {
            if (!export.getStatus().equals(Export.Status.COMPLETED)) {
                throw new ResourceNotFoundException();
            }
//            krameriusPlus.post()
//                    .uri("/exports/"+id+"/"+format).bodyValue(body).retrieve().bodyToMono(JobDto.class).block();
            //TODO check export id from K+
        }
        // TODO resend export
        return new byte[10];
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<Export> getAll(Principal user) {
        return exportRepository.findByUser(user.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/generate/{id}/{format}")
    public Export create(@PathVariable(value="id") String id, @PathVariable(value="format") String format, @RequestBody String body, Principal user) {
        JobDto job = krameriusPlus.post()
                .uri("/exports/"+id+"/"+format).bodyValue(body).retrieve().bodyToMono(JobDto.class).block();

        Export export = new Export();
        export.setJobId(job.getId());
        export.setPublicationId(job.getPublicationId());
        export.setCreated(job.getCreated());
        export.setStatus(job.getLastExecutionStatus());
        export.setUser(user.getName());
        exportRepository.saveAndFlush(export);

        return export;
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
