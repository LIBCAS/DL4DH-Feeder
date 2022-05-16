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
public class PublicationsListDto {

    @NotNull
    private Long numFound;

    @NotNull
    private Long start;

    @NotNull
    private List<PublicationDto> docs;
}
