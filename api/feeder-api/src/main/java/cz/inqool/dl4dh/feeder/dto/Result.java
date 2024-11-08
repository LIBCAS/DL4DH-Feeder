package cz.inqool.dl4dh.feeder.dto;

import lombok.Data;

import java.util.List;

@Data
public class Result<T> {

    private final long page;
    private final long pageSize;
    private final long total;
    private final List<T> items;
}
