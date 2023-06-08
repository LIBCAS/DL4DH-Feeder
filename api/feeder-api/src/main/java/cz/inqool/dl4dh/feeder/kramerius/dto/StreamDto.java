package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * @author Peter Sekan
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StreamDto {

    @NotNull
    private String label;

    @NotNull
    private String mimeType;

}
