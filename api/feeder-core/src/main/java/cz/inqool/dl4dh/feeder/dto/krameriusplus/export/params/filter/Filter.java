package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params.filter;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.EqualsAndHashCode;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "operation")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "EQ", value = EqFilter.class),
        @JsonSubTypes.Type(name = "OR", value = OrFilter.class),
        @JsonSubTypes.Type(name = "GT", value = GtFilter.class),
        @JsonSubTypes.Type(name = "AND", value = AndFilter.class),
        @JsonSubTypes.Type(name = "LT", value = LtFilter.class),
        @JsonSubTypes.Type(name = "NULL", value = NullFilter.class),
        @JsonSubTypes.Type(name = "REGEX", value = RegexFilter.class),
        @JsonSubTypes.Type(name = "IN", value = InFilter.class)
})
@EqualsAndHashCode
public abstract class Filter {
}
