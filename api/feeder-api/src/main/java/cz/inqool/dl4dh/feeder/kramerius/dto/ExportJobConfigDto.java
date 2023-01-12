package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.kramerius.dto.params.ParamsDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.params.TeiParamsDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportJobConfigDto {

    public enum Format {
        JSON,
        TEI,
        CSV,
        ALTO,
        TEXT
    }

    private Format exportFormat;
    private String delimiter;
    private TeiParamsDto teiParams;
    private ParamsDto params;
}
