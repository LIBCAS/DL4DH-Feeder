package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ExportRequestCreateDto {
    /**
     * Optional name for the request
     */
    private String name;

    /**
     * List of root publication UUIDs to process in the request
     */
    private List<String> publicationIds = new ArrayList<>();

    private ExportJobConfigDto config;

}
