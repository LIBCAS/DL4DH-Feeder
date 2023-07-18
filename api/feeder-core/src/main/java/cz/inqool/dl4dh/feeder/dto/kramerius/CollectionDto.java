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
public class CollectionDto {

    @NotNull
    private TranslationsDto descs;

    @NotNull
    private Boolean canLeave;

    @NotNull
    @Schema(example = "32")
    private Integer numberOfDocs;

    @NotNull
    @Schema(example = "vc:05ae4510-72d4-4027-8c7a-e28d3f6900fb")
    private String pid;

}
