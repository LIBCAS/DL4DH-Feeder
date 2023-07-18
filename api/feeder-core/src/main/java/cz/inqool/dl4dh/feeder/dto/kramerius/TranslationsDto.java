package cz.inqool.dl4dh.feeder.dto.kramerius;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@Setter
public class TranslationsDto {

    @NotNull
    @Schema(example = "Pohádky")
    private String cs;

    @NotNull
    @Schema(example = "Fairy Tales")
    private String en;

}
