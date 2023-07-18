package cz.inqool.dl4dh.feeder.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class CurrentUserDto {
    @Schema(example = "user@example.com")
    String name;

    @ArraySchema(schema = @Schema(example = "dl4dh-admin"))
    List<String> roles;
}
