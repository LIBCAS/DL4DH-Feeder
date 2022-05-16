package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentPageDto {
    private String id;
    private KrameriusPlusDocumentNameTagMetadataDto nameTagMetadata;
}
