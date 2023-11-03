package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KrameriusJobInstanceDto {
    private String id;
    private String created;
    private Export.Status executionStatus;
}
