package cz.inqool.dl4dh.feeder.enums;


import java.util.Set;

public enum DocumentState {

    WAITING,
    APPROVED,
    ENRICHED,
    OTHER;

    public Set<DocumentState> getTransitions() {
        switch (this) {
            case WAITING:
                return Set.of(APPROVED);
            case APPROVED:
                return Set.of(ENRICHED, OTHER);
            case ENRICHED:
                return Set.of(OTHER);
            case OTHER:
                return Set.of(APPROVED, ENRICHED);
        }

        throw new IllegalStateException("Unknown document state: " + this);
    }
}
