package cz.inqool.dl4dh.feeder.krameriusplus.export;

import lombok.Getter;

import static cz.inqool.dl4dh.feeder.krameriusplus.export.KrameriusJobType.EXPORT_JSON;

@Getter
public class ExportJsonJobConfigDto extends ExportJobConfigDto {

    private final KrameriusJobType jobType = EXPORT_JSON;

    @Override
    public ExportFormat getExportFormat() {
        return ExportFormat.JSON;
    }
}
