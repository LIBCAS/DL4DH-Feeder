package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exports_items")
public class ExportItem extends AuditModel {

    @Id
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private UUID id;

    @Column(columnDefinition = "text")
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonIgnore
    private String fileId;

    @Column(columnDefinition = "text")
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String publicationId;

    @Column(columnDefinition = "text")
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String publicationTitle;

    @Enumerated(EnumType.STRING)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Export.Status status;

    @ManyToOne
    @JoinColumn(name = "export_id", nullable = false)
    @JsonIgnore
    private Export export;

    public boolean isFinished() {
        return status.equals(Export.Status.COMPLETED) ||
                status.equals(Export.Status.SUCCESSFUL) ||
                status.equals(Export.Status.FAILED) ||
                status.equals(Export.Status.FAILED_FATALLY) ||
                status.equals(Export.Status.CANCELLED) ||
                status.equals(Export.Status.STOPPED) ||
                status.equals(Export.Status.ABANDONED);
    }
}
