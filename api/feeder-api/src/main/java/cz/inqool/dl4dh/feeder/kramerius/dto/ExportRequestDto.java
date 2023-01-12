package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ExportRequestDto {
    private String id;
    private String created;
    private String name;
    private Export.Status state;
    private BulkExportDto bulkExport;
    private Set<String> publicationIds;
    private ExportJobConfigDto config;
}
