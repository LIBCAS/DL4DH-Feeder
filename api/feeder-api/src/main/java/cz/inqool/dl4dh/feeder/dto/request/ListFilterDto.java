package cz.inqool.dl4dh.feeder.dto.request;

import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import cz.inqool.dl4dh.feeder.enums.UserRequestType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ListFilterDto {

    @Builder.Default
    RootFilterOperation rootFilterOperation = RootFilterOperation.AND;

    Integer year;

    Integer identification;

    UserRequestState state;

    UserRequestType type;

    String username;

    @Builder.Default
    Sort.Order order = Sort.Order.DESC;

    @Builder.Default
    Sort.Field field = Sort.Field.CREATED;

    public enum  RootFilterOperation {
        AND,
        OR
    }
}
