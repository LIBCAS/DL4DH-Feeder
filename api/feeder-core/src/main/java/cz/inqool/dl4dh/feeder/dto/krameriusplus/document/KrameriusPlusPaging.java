package cz.inqool.dl4dh.feeder.dto.krameriusplus.document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class KrameriusPlusPaging<T> {
    private int pageSize;
    private int page;
    private int total;
    private List<T> items;
}
