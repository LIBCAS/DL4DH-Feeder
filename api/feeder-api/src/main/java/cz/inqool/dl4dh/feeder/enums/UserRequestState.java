package cz.inqool.dl4dh.feeder.enums;

import java.util.Collections;
import java.util.Set;

public enum UserRequestState {

    CREATED,
    IN_PROGRESS,
    WAITING_FOR_USER,
    APPROVED,
    PROLONGING,
    REJECTED;

    public Set<UserRequestState> getValidTransitions() {
        switch (this) {
            case CREATED:
                return Set.of(IN_PROGRESS, WAITING_FOR_USER);
            case IN_PROGRESS:
                return Set.of(REJECTED, WAITING_FOR_USER, APPROVED);
            case WAITING_FOR_USER:
            case PROLONGING:
                return Set.of(IN_PROGRESS);
            case APPROVED:
                return Set.of(PROLONGING);
            case REJECTED:
                return Collections.emptySet();
        }

        throw new IllegalStateException("Uknown state type: " + this);
    }
}
