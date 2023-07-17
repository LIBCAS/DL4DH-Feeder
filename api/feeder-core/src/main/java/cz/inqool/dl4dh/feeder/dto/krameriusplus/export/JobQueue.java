package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

/**
 * Convenient helper class with queue constants
 */
public class JobQueue {
    /**
     * Queue used for enrichment jobs. Operations might take a long time, so high concurrency
     * is expected.
     */
    public static final String ENRICHMENT_QUEUE = "enrichment";

    /**
     * Queue used for export jobs. Operations should not take too long, so low concurrency
     * is expected.
     */
    public static final String EXPORT_QUEUE = "export";

    /**
     * Default queue for fast operations, like creating requests.
     */
    public static final String DEFAULT_QUEUE = "default";

    /**
     * Priority queue for important operations, that need to be executed quickly.
     * Should be empty most of the time.
     */
    public static final String PRIORITY_QUEUE = "priority";
}
