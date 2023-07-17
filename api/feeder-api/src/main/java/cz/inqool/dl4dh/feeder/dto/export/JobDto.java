package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobDto {
    private String id;
    private String created;
    private String publicationId;
    private Export.Status lastExecutionStatus;
    private JobConfigDto config;
}
