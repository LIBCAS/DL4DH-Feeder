package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SolrGroupDoclistDto {
    @NotNull
    private Long numFound;

    @NotNull
    private Long start;

    @NotNull
    private Float maxScore;

    @NotNull
    private List<Map<String, Object>> docs;
}

