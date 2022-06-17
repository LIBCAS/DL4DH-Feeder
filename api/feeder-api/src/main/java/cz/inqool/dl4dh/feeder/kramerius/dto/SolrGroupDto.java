package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class SolrGroupDto {
    @NotNull
    private Integer matches;

    @NotNull
    private List<SolrGroupItemDto> groups;
}

