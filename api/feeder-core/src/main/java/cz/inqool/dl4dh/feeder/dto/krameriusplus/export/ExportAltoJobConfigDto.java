package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import lombok.Getter;

import static cz.inqool.dl4dh.feeder.dto.krameriusplus.export.KrameriusJobType.EXPORT_ALTO;

@Getter
public class ExportAltoJobConfigDto extends ExportJobConfigDto {
    private final KrameriusJobType jobType = EXPORT_ALTO;

    @Override
    public ExportFormat getExportFormat() {
        return ExportFormat.ALTO;
    }

}
