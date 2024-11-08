package cz.inqool.dl4dh.feeder.dto.request.audit;

import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class StateAuditDto {

    private Instant created;

    private String username;

    private UserRequestState before;

    private UserRequestState after;
}
