package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.dto.KrameriusPlusExportDto;
import cz.inqool.dl4dh.feeder.dto.KrameriusPlusFileRefDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkExportDto {
    private String id;
    private KrameriusPlusFileRefDto fileRef;
}
