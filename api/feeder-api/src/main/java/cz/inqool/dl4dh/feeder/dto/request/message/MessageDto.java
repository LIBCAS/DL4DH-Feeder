package cz.inqool.dl4dh.feeder.dto.request.message;

import cz.inqool.dl4dh.feeder.dto.FileRefDto;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class MessageDto {

    private String id;

    private List<FileRefDto> files;

    private String message;

    private String author;

    private Instant created;

    private Instant updated;
}
