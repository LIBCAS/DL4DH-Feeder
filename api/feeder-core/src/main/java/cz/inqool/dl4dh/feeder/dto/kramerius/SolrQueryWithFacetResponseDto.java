package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
public class SolrQueryWithFacetResponseDto extends SolrQueryResponseDto {
    @NotNull
    private SolrFacetDto facet_counts;

    private Map<String, SolrGroupDto> grouped;
}

