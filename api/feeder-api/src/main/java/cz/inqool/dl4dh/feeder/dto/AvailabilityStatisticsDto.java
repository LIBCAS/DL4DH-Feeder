package cz.inqool.dl4dh.feeder.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@AllArgsConstructor
public class AvailabilityStatisticsDto {

    @NotNull
    @JsonProperty("public")
    private Integer pub;

    @NotNull
    @JsonProperty("private")
    private Integer priv;
}
