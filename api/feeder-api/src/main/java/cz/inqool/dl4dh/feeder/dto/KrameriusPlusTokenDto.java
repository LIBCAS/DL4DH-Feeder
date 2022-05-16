package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusTokenDto {
    private String content;
    private KrameriusPlusLinguisticMetadataDto linguisticMetadata;
}
