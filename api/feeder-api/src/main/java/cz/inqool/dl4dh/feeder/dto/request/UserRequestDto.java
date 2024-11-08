package cz.inqool.dl4dh.feeder.dto.request;

import cz.inqool.dl4dh.feeder.dto.request.audit.StateAuditDto;
import cz.inqool.dl4dh.feeder.dto.request.message.MessageDto;
import cz.inqool.dl4dh.feeder.dto.request.part.UserRequestPartDto;
import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import cz.inqool.dl4dh.feeder.enums.UserRequestType;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserRequestDto {

    private String id;

    private Instant created;

    private Instant updated;

    private UserRequestType type;

    private UserRequestState state;

    private String username;

    private String identification;

    private List<UserRequestPartDto> parts = new ArrayList<>();

    private List<MessageDto> messages = new ArrayList<>();

    private List<StateAuditDto> stateChanges = new ArrayList<>();
}
