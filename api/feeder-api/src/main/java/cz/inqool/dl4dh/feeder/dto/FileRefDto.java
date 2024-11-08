package cz.inqool.dl4dh.feeder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileRefDto extends DatedObjectDto {

    private String name;

    private String contentType;

    private Long size;
}
