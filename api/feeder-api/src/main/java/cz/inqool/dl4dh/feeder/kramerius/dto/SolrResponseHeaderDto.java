package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SolrResponseHeaderDto {
    private Map<String, Object> params;
    private Long QTime;
    private Long status;
}
