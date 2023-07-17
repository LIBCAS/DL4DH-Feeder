package cz.inqool.dl4dh.feeder.dto.export;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobConfigParamsDto {
    private String params;
    private String teiExportParams;
    private String delimiter;
}
