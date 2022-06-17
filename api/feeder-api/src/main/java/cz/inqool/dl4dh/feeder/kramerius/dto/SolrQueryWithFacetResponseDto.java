package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
public class SolrQueryWithFacetResponseDto {
    @NotNull
    private SolrResponseDto response;

    @NotNull
    private SolrResponseHeaderDto responseHeader;

    @NotNull
    private SolrFacetDto facet_counts;

    private Map<String, SolrGroupDto> grouped;
}

