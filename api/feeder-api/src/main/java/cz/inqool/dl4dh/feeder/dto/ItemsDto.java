package cz.inqool.dl4dh.feeder.dto;

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
    private Integer value;
}
