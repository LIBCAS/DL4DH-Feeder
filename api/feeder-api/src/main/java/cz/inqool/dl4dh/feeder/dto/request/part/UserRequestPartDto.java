package cz.inqool.dl4dh.feeder.dto.request.part;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UserRequestPartDto {

    private String publicationId;

    private String state;

    private String note;

    private Instant stateUntil;
}
