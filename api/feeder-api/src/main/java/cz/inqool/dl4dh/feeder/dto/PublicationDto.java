package cz.inqool.dl4dh.feeder.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
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
public class PublicationDto {

    @NotNull
    @Schema(example = "monograph")
    private String model;

    @NotNull
    @Schema(example = "public")
    private String availability;

    @NotNull
    @Schema(example = "1903")
    private String date;

    @NotNull
    @ArraySchema(schema = @Schema(example = "Aleš, Mikoláš"))
    private List<String> authors;

    @NotNull
    @Schema(example = "Anatomický atlas koně a krávy")
    private String title;

    @NotNull
    @Schema(example = "uuid:541ac050-b54d-11ea-998c-005056827e51")
    private String pid;

    @NotNull
    @ArraySchema(schema = @Schema(example = "uuid:541ac050-b54d-11ea-998c-005056827e51"))
    private List<String> parentPid;

    @NotNull
    @Schema(example = "Anatomický atlas koně a krávy")
    private String rootTitle;

    @NotNull
    private boolean enriched;

    private Long occurrences;
}
