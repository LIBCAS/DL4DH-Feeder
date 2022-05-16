package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentNameTagMetadataDto {
    private Map<String, List<KrameriusPlusDocumentNameTagEntityDto>> namedEntities;
}
