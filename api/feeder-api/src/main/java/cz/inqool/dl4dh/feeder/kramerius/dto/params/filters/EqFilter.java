package cz.inqool.dl4dh.feeder.kramerius.dto.params.filters;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EqFilter extends Filter {

    private String field;

    private Object value;
}
