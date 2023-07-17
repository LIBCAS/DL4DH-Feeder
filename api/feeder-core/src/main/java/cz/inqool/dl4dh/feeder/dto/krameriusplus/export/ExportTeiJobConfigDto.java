package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.TeiParams;
import lombok.Getter;
import lombok.Setter;

import static cz.inqool.dl4dh.feeder.dto.krameriusplus.export.KrameriusJobType.EXPORT_TEI;

@Getter
@Setter
public class ExportTeiJobConfigDto extends ExportJobConfigDto {

    private final KrameriusJobType jobType = EXPORT_TEI;

    private TeiParams teiParams = new TeiParams();

    @Override
    public ExportFormat getExportFormat() {
        return ExportFormat.TEI;
    }
}

