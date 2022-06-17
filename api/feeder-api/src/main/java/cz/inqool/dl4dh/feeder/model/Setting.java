package cz.inqool.dl4dh.feeder.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "settings")
public class Setting extends AuditModel {

	@Id
//    @Lob
//    @Column(columnDefinition = "text", nullable = false, name = "k")
    private String key;
	
    @Column(columnDefinition = "text")
    private String value;

}
