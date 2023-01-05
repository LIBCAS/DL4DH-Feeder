package cz.inqool.dl4dh.feeder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.dl4dh.feeder.enums.FilterOperatorEnum;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nametag_filters")
public class NameTagFilter extends AuditModel {

    @Id
    @GeneratedValue(generator = "nametag_filter_generator")
    @SequenceGenerator(
            name = "nametag_filter_generator",
            sequenceName = "nametag_filter_sequence"
    )
    private Long id;

    @Column(columnDefinition = "text")
    private NameTagEntityType type;

    @Column(columnDefinition = "text")
    private FilterOperatorEnum operator;

    @ElementCollection
    private Set<String> values;


    @ManyToOne
    @JoinColumn(name = "filter_id", nullable = false)
    @JsonIgnore
    private Filter filter;

    public String toFilter() {
        return (operator == FilterOperatorEnum.EQUAL ? "" : "NOT ") + "(" +
                values.stream()
                        .map(v -> type.getSolrField() + ":\"" + v.replaceAll("\"", "\\\\\"") + "\"")
                        .collect(Collectors.joining(" OR "))
                + ")";
    }
}
