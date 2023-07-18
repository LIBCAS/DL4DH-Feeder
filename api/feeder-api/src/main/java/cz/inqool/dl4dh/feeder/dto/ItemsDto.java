package cz.inqool.dl4dh.feeder.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class ItemsDto {

    @NotNull
    private String name;

    @NotNull
    @Schema(example = "32")
    private Integer value;
}
