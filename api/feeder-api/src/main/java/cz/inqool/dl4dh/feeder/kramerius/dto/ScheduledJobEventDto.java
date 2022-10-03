package cz.inqool.dl4dh.feeder.kramerius.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduledJobEventDto {
    private String id;
    private String created;
    private Integer order;
    private JobDto jobEvent;
}
