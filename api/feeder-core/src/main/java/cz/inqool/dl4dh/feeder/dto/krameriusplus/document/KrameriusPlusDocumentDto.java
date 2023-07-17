package cz.inqool.dl4dh.feeder.dto.krameriusplus.document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentDto {
    private String id;
    private List<KrameriusPlusDocumentContextDto> context;
    private List<KrameriusPlusDocumentPageDto> pages;
    private KrameriusPlusDocumentPublishInfoDto publishInfo;
    private String title;
    private String police;
    private String model;
}
