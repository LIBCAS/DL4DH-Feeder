package cz.inqool.dl4dh.feeder.dto.info;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FeederInfoDto {

    @Schema(example = "1.3.0")
    private String version;

    @Schema(example = "example@example.com")
    private String contact;
}
