package cz.inqool.dl4dh.feeder.dto.info;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown=true)
public class KrameriusVersionDto {

    @Schema(example = "5.8.3")
    private String version;

    @Schema(example = "Národní knihovna České republiky")
    private String name;

    @Schema(example = "National Library of the Czech Republic")
    private String name_en;

    @Schema(example = "https://api.registr.digitalniknihovna.cz/libraries/nkp/logo")
    private String logo;

    @Schema(example = "https://www.ndk.cz")
    private String url;
}
