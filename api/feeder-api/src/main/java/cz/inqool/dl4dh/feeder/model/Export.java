package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
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
        ENQUEUED,
        RUNNING,
        COMPLETED,
        SUCCESSFUL,
        FAILED,
        FAILED_FATALLY,
        CANCELLED,
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
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, example = "152")
    @GeneratedValue(generator = "export_generator")
    @SequenceGenerator(
            name = "export_generator",
            sequenceName = "export_sequence"
    )
    private Long id;

    @JsonIgnore
    private String username;

    @ElementCollection
    @ArraySchema(schema = @Schema(example = "uuid:df196150-64dd-11e4-b42a-005056827e52"))
    private Set<String> publicationIds;

    @Schema(example = "Anatomický atlas koně a krávy")
    private String publicationTitle;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, example = "2023-06-28T17:31:00.764+02:00")
    private String created;

    @Schema(example = ",")
    private String delimiter;

    @Column(columnDefinition = "text")
    @Schema(example = "{  \"sorting\" : [ ],  \"filters\" : [ ],  \"includeFields\" : [ ],  \"excludeFields\" : [ ]}")
    private String parameters;

    @Column(columnDefinition = "text")
    @Schema(example = "{}")
    private String teiParameters;

    @Enumerated(EnumType.STRING)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Format format;

    @JsonIgnore
    @Column(columnDefinition = "text")
    private String jobId;

    @JsonIgnore
    @Column(columnDefinition = "text")
    private String exportId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy="export")
    private List<ExportItem> items;

    public boolean isFinished() {
        return status.equals(Status.COMPLETED) ||
                status.equals(Status.SUCCESSFUL) ||
                status.equals(Status.FAILED) ||
                status.equals(Status.PARTIAL);
    }
}
