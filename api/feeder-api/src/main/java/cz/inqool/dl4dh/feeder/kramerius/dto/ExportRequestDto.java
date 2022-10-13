package cz.inqool.dl4dh.feeder.kramerius.dto;

import cz.inqool.dl4dh.feeder.model.Export;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportRequestDto {
    private String id;
    private String created;
    private String name;
    private JobPlanDto jobPlan;
    private BulkExportDto bulkExport;
}
