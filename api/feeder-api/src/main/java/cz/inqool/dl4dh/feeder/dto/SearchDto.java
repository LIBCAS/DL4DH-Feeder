package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.dto.openapi.OpenAPIAvailableFilters;
import cz.inqool.dl4dh.feeder.dto.openapi.OpenAPIAvailableNameTagFilters;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@AllArgsConstructor
@Getter
public class SearchDto {
    private PublicationsListDto documents;

    @Schema(implementation = OpenAPIAvailableFilters.class)
    private Map<String, Map<String, Object>> availableFilters;

    @Schema(implementation = OpenAPIAvailableNameTagFilters.class)
    private Map<String, Map<String, Object>> availableNameTagFilters;
}
