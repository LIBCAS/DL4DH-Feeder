package cz.inqool.dl4dh.feeder.dto.request;

import cz.inqool.dl4dh.feeder.enums.UserRequestType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@Validated
public class UserRequestCreateDto {

    @NotNull
    private UserRequestType type;

    @NotNull
    @Size(min = 1)
    private List<String> publicationIds;

    @NotNull
    private String message;
}
