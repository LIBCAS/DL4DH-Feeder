package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.FilterOperatorEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class NameTagFilterDto {
    private NameTagEntityType type;
    private FilterOperatorEnum operator;
    private Set<String> values;

    public String toFilter() {
        return (operator == FilterOperatorEnum.EQUAL ? "" : "NOT ") + "(" +
                values.stream()
                    .map(v -> type.getSolrField()+":\""+v+"\"")
                    .collect(Collectors.joining(" OR "))
                + ")";
    }
}
