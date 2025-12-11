package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.krameriusplus.export.ExportRequestCreateDto;
import cz.inqool.dl4dh.feeder.model.Export;
import cz.inqool.dl4dh.feeder.model.ExportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface ExportService {

    Page<Export> get(String userName, Pageable p);
    Export create(String userName, ExportRequestCreateDto request);
    ResponseEntity<byte[]> download(Export export);
    ResponseEntity<byte[]> downloadItem(ExportItem item);
    void refreshState(Export export);
}
