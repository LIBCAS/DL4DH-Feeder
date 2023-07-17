package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import lombok.Getter;

@Getter
public class ExportTextJobConfigDto extends ExportJobConfigDto {

    private final KrameriusJobType jobType = KrameriusJobType.EXPORT_TEXT;

    @Override
    public ExportFormat getExportFormat() {
        return ExportFormat.TEXT;
    }
}
