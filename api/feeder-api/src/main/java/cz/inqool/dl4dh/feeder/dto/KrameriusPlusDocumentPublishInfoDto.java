package cz.inqool.dl4dh.feeder.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusDocumentPublishInfoDto {
    private Boolean isPublished;
    private String publishedLastModified;
}
