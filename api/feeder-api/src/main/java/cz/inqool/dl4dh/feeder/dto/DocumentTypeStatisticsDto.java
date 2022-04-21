package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class DocumentTypeStatisticsDto {

    @NotNull
    private Integer monograph;

    @NotNull
    private Integer periodical;

    @NotNull
    private Integer map;

    @NotNull
    private Integer graphics;

    @NotNull
    private Integer archival;

    @NotNull
    private Integer manuscript;
}
