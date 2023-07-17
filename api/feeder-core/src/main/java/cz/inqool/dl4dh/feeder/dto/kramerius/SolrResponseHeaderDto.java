package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class SolrResponseHeaderDto {
    private Map<String, Object> params;
    private Long QTime;
    private Long status;
}
