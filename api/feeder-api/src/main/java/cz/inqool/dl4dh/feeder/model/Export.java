package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exports")
public class Export extends AuditModel {

    public enum Status {
        CREATED,
        RUNNING,
        COMPLETED,
        SUCCESSFUL,
        FAILED,
        PARTIAL,
        STARTING,
        STARTED,
        STOPPING,
        STOPPED,
        ABANDONED,
        UNKNOWN
    }

    public enum Format {
        TEXT,
        TEI,
        JSON,
        CSV,
        ALTO
    }

	@Id
    @GeneratedValue(generator = "export_generator")
    @SequenceGenerator(
            name = "export_generator",
            sequenceName = "export_sequence"
    )
    private Long id;

    private String username;

    @ElementCollection
    private Set<String> publicationIds;

    private String publicationTitle;

    private String created;

    private String delimiter;

    @Column(columnDefinition = "text")
    private String parameters;

    @Column(columnDefinition = "text")
    private String teiParameters;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Format format;

    @JsonIgnore
    @Column(columnDefinition = "text")
    private String jobId;

    @JsonIgnore
    @Column(columnDefinition = "text")
    private String exportId;

    public boolean isFinished() {
        return status.equals(Status.COMPLETED) ||
                status.equals(Status.SUCCESSFUL) ||
                status.equals(Status.FAILED) ||
                status.equals(Status.PARTIAL);
    }
}
