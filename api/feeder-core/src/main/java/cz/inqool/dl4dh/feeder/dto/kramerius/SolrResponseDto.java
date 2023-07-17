package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SolrResponseDto {
    private List<Map<String, Object>> docs;
    private Long numFound;
    private Long start;
}
