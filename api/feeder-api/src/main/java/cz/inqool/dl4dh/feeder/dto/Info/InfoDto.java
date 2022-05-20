package cz.inqool.dl4dh.feeder.dto.Info;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InfoDto {
    private String version;
    private KrameriusPlusInfoDto kramerius;
    private KrameriusPlusVersionDto krameriusPlus;
}
