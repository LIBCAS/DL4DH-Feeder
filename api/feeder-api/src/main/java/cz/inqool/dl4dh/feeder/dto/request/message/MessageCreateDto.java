package cz.inqool.dl4dh.feeder.dto.request.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Validated
@AllArgsConstructor
@NoArgsConstructor
public class MessageCreateDto {

    @NotNull
    @NotBlank
    private String message;
}
