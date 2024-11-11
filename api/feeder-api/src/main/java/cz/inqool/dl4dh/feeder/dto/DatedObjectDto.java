package cz.inqool.dl4dh.feeder.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public abstract class DatedObjectDto extends DomainObjectDto {

    protected Instant created;

    protected Instant updated;

    protected Instant deleted;

    @Override
    public String toString() {
        return "DatedObjectDto{" +
                "created=" + created +
                ", updated=" + updated +
                ", deleted=" + deleted +
                ", id='" + id + '\'' +
                '}';
    }
}
