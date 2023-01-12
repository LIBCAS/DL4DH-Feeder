package cz.inqool.dl4dh.feeder.kramerius.dto.params;

import cz.inqool.dl4dh.feeder.kramerius.dto.params.filters.Filter;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ParamsDto {
    private Paging paging;
    private List<Sorting> sorting;
    private List<Filter> filters;
    private List<String> includeFields;
    private List<String> excludeFields;
}
