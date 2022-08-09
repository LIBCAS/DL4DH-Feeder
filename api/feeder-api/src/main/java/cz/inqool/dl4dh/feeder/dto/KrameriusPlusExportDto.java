package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.kramerius.dto.JobDto;
import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KrameriusPlusExportDto {
    private String id;
    private JobDto jobEvent;
    private KrameriusPlusFileRefDto fileRef;
}
