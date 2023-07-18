package cz.inqool.dl4dh.feeder.dto.info;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KrameriusPlusVersionDto {

    @Schema(example = "1.0.3")
    private String version;

    @Schema(example = "2023-07-17T11:27:56.25")
    private String timeOfLastBuild;
}
