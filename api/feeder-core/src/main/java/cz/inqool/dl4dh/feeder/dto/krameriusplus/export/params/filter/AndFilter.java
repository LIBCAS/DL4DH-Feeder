package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.filter;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AndFilter extends Filter {

    private List<Filter> filters;
}
