package cz.inqool.dl4dh.feeder.dto.request;

import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import cz.inqool.dl4dh.feeder.enums.UserRequestType;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UserRequestListDto {

    private String id;

    private Instant created;

    private Instant updated;

    private String username;

    private UserRequestType type;

    private UserRequestState state;

    private String identification;
}
