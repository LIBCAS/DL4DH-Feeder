package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

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
