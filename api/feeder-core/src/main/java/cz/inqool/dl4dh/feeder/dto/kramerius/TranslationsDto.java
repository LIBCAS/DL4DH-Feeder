package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@Setter
public class TranslationsDto {

    @NotNull
    private String cs;

    @NotNull
    private String en;

}
