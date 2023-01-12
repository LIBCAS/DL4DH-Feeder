package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.kramerius.dto.params.ParamsDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.params.TeiParamsDto;
import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportJobConfigDto {
    private Export.Format exportFormat;
    private String delimiter;
    private TeiParamsDto teiParams;
    private ParamsDto params;
}
