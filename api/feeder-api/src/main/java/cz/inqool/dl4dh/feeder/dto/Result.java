package cz.inqool.dl4dh.feeder.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Data
public class Result<T> {

    private long page;
    private long pageSize;
    private long total;
    private List<T> items;
}
