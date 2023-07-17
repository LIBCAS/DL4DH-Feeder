package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;


import lombok.Getter;
import lombok.Setter;

import static cz.inqool.dl4dh.feeder.dto.krameriusplus.export.KrameriusJobType.EXPORT_CSV;

@Getter
@Setter
public class ExportCsvJobConfigDto extends ExportJobConfigDto {

    private final KrameriusJobType jobType = EXPORT_CSV;

    private String delimiter = ",";

    @Override
    public ExportFormat getExportFormat() {
        return ExportFormat.CSV;
    }
}
