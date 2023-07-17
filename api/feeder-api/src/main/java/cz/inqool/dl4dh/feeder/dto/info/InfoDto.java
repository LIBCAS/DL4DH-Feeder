package cz.inqool.dl4dh.feeder.dto.info;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InfoDto {
    private FeederInfoDto feeder;
    private KrameriusPlusVersionDto krameriusPlus;
    private KrameriusVersionDto kramerius;
}
