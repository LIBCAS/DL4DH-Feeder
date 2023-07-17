package cz.inqool.dl4dh.feeder.dto.export;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobConfigDto {
    private String krameriusJob;
    private JobConfigParamsDto parameters;
}
