package cz.inqool.dl4dh.feeder.kramerius.dto.params;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sorting {

    public enum Sort {
        ASC, DESC
    }

    private String field;
    private Sort direction;
}
