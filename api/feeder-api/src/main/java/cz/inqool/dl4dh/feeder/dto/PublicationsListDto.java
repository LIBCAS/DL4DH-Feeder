package cz.inqool.dl4dh.feeder.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class PublicationsListDto {

    @NotNull
    @Schema(example = "320")
    private Long numFound;

    @NotNull
    @Schema(example = "1")
    private Long start;

    @NotNull
    private List<PublicationDto> docs;
}
