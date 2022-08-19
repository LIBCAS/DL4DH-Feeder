package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobConfigDto {
    private String krameriusJob;
    private JobConfigParamsDto parameters;
}
