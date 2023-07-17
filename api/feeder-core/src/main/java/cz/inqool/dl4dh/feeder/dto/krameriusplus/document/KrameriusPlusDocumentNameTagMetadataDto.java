package cz.inqool.dl4dh.feeder.dto.krameriusplus.document;

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
