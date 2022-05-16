package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class StatisticsListDto {

    @NotNull
    private Integer numFound;

    @NotNull
    private List<ItemsDto> items;
}
