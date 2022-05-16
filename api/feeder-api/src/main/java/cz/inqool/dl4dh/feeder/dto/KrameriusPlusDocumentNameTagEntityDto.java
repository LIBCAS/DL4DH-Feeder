package cz.inqool.dl4dh.feeder.dto;

import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentNameTagEntityDto {
    private String entityType;
    private List<KrameriusPlusTokenDto> tokens;
}
