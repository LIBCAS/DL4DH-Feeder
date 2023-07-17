package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.filter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegexFilter extends Filter {

    private String field;

    private String value;
}
