package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.SearchDto;
import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.ExportRequestCreateDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.model.ExportItem;
import cz.inqool.dl4dh.feeder.model.Filter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.util.List;
import java.util.Set;

public interface ExportService {

    Page<Export> get(String userName, Pageable p);
    Export create(String userName, ExportRequestCreateDto request);
    ResponseEntity<byte[]> download(Export export);
    ResponseEntity<byte[]> downloadItem(ExportItem item);
    void refreshState(Export export);
}
