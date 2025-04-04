package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class SolrGroupDto {
    @NotNull
    private Integer matches;

    private Long ngroups = null;

    @NotNull
    private List<SolrGroupItemDto> groups;
}

