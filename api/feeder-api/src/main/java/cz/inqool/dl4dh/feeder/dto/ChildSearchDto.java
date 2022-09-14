package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Getter
public class ChildSearchDto {
    private List<String> textOcr;
    private Map<String, List<String>> nameTag;
}
