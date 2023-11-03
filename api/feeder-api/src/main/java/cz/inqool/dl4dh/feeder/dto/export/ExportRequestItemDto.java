package cz.inqool.dl4dh.feeder.dto.export;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportRequestItemDto {
    private String id;
    private String publicationId;
    private String publicationTitle;
    private KrameriusExportDto rootExport;
}
