package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.dto.krameriusplus.document.KrameriusPlusFileRefDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KrameriusPlusExportDto {
    private String id;
    private JobDto jobEvent;
    private KrameriusPlusFileRefDto fileRef;
}
