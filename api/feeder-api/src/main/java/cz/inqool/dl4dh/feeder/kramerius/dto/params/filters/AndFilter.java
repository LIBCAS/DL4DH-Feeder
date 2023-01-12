package cz.inqool.dl4dh.feeder.kramerius.dto.params.filters;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AndFilter extends Filter {

    private List<Filter> filters;
}
