package cz.inqool.dl4dh.feeder.dto.Info;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown=true)
public class KrameriusVersionDto {
    private String version;
    private String name;
    private String name_en;
    private String logo;
    private String url;
}
