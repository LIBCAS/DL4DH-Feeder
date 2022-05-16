package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
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
}
