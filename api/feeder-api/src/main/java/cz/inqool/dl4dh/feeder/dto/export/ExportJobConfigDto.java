package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.ParamsDto;
import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.TeiParams;
import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportJobConfigDto {
    private Export.Format exportFormat;
    private String delimiter;
    private TeiParams teiParams;
    private ParamsDto params;
}
