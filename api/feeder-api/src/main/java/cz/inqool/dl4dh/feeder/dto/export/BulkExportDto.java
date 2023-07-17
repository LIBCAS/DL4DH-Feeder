package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.dto.krameriusplus.document.KrameriusPlusFileRefDto;
import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkExportDto {
    private String id;
    private KrameriusPlusFileRefDto file;
    private Export.Status state;
}
