package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ExportRequestCreateDto {
    /**
     * Optional name for the request
     */
    @Schema(example = "Muj export")
    private String name;

    /**
     * List of root publication UUIDs to process in the request
     */
    @ArraySchema(schema = @Schema(example = "uuid:df196150-64dd-11e4-b42a-005056827e52"))
    private List<String> publicationIds = new ArrayList<>();

    private ExportJobConfigDto config;

}
