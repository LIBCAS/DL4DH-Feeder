package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.ParamsDto;
import lombok.Getter;
import lombok.Setter;

import static cz.inqool.dl4dh.feeder.dto.krameriusplus.export.KrameriusJobType.KrameriusJobTypeName.*;

@Getter
@Setter
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "jobType")
@JsonSubTypes({
        @JsonSubTypes.Type(name = EXPORT_ALTO, value = ExportAltoJobConfigDto.class),
        @JsonSubTypes.Type(name = EXPORT_TEXT, value = ExportTextJobConfigDto.class),
        @JsonSubTypes.Type(name = EXPORT_JSON, value = ExportJsonJobConfigDto.class),
        @JsonSubTypes.Type(name = EXPORT_CSV, value = ExportCsvJobConfigDto.class),
        @JsonSubTypes.Type(name = EXPORT_TEI, value = ExportTeiJobConfigDto.class)
})
public abstract class ExportJobConfigDto extends JobConfigDto {

    private ParamsDto params = new ParamsDto();

    public abstract ExportFormat getExportFormat();

}
