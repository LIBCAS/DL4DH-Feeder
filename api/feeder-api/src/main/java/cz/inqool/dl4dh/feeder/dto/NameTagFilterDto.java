package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.FilterOperatorEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class NameTagFilterDto {
    private NameTagEntityType type;
    private FilterOperatorEnum operator;
    private Set<String> values;
}
