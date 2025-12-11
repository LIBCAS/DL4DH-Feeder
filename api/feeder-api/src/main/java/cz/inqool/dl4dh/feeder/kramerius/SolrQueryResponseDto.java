package cz.inqool.dl4dh.feeder.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class SolrQueryResponseDto {
    @NotNull
    private SolrResponseDto response;

    @NotNull
    private SolrResponseHeaderDto responseHeader;
}

