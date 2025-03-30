package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class SolrGroupItemDto {
    @NotNull
    private String groupValue;

    @NotNull
    private SolrGroupDoclistDto doclist;
}

