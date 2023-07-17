package cz.inqool.dl4dh.feeder.dto.kramerius;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SolrHighlightTextOcrDto {
    private List<String> text_ocr;
}
