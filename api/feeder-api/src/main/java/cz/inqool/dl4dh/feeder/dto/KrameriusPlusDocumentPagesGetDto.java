package cz.inqool.dl4dh.feeder.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentPagesGetDto {
    private int limit;
    private int offset;
    private int total;
    private boolean empty;
    private List<KrameriusPlusDocumentPageDto> results;
}
