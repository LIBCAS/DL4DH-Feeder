package cz.inqool.dl4dh.feeder.dto.export;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ExportRequestDto {
    private String id;
    private String created;
    private String name;
    private Export.Status state;
    private BulkExportDto bulkExport;
    private List<ExportRequestItemDto> items;
    private Set<String> publicationIds;
    private ExportJobConfigDto config;
}
