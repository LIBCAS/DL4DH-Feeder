package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params;

import cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.filter.Filter;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class ParamsDto {

    /**
     * Paging configuration
     * Not applying, if paging equals to null
     */
    protected Paging paging = null;

    /**
     * Sorting configuration
     * Not applying, if paging equals to null
     */
    protected List<Sorting> sorting = new ArrayList<>();

    /**
     * List of filters that will be applied. The operator between them is by default AND
     */
    protected List<Filter> filters = new ArrayList<>();

    protected List<String> includeFields = new ArrayList<>();

    protected List<String> excludeFields = new ArrayList<>();
}
