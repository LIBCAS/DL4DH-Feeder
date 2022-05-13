package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@AllArgsConstructor
@Getter
public class SearchDto {
    private PublicationsListDto documents;
    private Map<String, Map<String, Integer>> availableFilters;
}
