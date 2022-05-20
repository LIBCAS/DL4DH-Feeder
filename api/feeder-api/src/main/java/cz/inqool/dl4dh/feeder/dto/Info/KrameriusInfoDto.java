package cz.inqool.dl4dh.feeder.dto.Info;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KrameriusInfoDto {
    private Info info;

    public KrameriusPlusInfoDto krameriusInfoDto() {
        return new KrameriusPlusInfoDto(
                info.getVersion(),
                info.getName(),
                info.getName_en(),
                info.getLogo()
        );
    }
}

@Getter
@Setter
class Info {
    private String version;
    private String name;
    private String name_en;
    private String logo;
}