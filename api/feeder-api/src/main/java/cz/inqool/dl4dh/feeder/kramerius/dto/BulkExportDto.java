package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.dto.KrameriusPlusFileRefDto;
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
