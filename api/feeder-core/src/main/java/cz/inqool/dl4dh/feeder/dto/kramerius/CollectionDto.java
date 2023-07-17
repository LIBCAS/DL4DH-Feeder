package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@Setter
public class CollectionDto {

    @NotNull
    private TranslationsDto descs;

    @NotNull
    private Boolean canLeave;

    @NotNull
    private Integer numberOfDocs;

    @NotNull
    private String pid;

}
