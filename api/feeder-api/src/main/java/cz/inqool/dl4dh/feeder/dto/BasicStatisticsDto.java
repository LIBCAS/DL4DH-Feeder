package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class BasicStatisticsDto {

    @NotNull
    private AvailabilityStatisticsDto availability;

    @NotNull
    private DocumentTypeStatisticsDto documentType;

}

