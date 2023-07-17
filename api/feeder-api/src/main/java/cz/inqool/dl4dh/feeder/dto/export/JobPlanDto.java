package cz.inqool.dl4dh.feeder.dto.export;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobPlanDto {
    private String id;
    private String created;
    private String publicationId;
    private List<ScheduledJobEventDto> scheduledJobEvents;
}
