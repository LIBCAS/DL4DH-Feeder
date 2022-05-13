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
public class PublicationDto {

    @NotNull
    private String model;

    @NotNull
    private String availability;

    @NotNull
    private String date;

    @NotNull
    private List<String> authors;

    @NotNull
    private String title;

    @NotNull
    private String pid;

    @NotNull
    private String rootTitle;
}
