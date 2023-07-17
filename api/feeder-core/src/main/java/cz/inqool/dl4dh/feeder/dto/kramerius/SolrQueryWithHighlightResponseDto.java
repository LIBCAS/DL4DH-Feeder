package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
public class SolrQueryWithHighlightResponseDto extends SolrQueryResponseDto {
    @NotNull
    private Map<String, SolrHighlightTextOcrDto> highlighting;
}
