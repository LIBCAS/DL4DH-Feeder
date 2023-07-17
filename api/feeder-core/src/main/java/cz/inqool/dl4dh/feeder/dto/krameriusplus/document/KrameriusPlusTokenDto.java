package cz.inqool.dl4dh.feeder.dto.krameriusplus.document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusTokenDto {
    private String content;
    private KrameriusPlusLinguisticMetadataDto linguisticMetadata;
}
