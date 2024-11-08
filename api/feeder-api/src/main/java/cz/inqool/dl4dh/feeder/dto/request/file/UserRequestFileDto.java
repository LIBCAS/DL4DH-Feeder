package cz.inqool.dl4dh.feeder.dto.request.file;

import cz.inqool.dl4dh.feeder.dto.FileRefDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestFileDto {

    private String id;

    private FileRefDto fileRef;
}
