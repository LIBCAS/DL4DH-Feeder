package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import lombok.Getter;

import static cz.inqool.dl4dh.feeder.dto.krameriusplus.export.JobQueue.EXPORT_QUEUE;

public enum KrameriusJobType {
    EXPORT_ALTO(KrameriusJobTypeName.EXPORT_ALTO, EXPORT_QUEUE),
    EXPORT_TEXT(KrameriusJobTypeName.EXPORT_TEXT, EXPORT_QUEUE),
    EXPORT_CSV(KrameriusJobTypeName.EXPORT_CSV, EXPORT_QUEUE),
    EXPORT_JSON(KrameriusJobTypeName.EXPORT_JSON, EXPORT_QUEUE),
    EXPORT_TEI(KrameriusJobTypeName.EXPORT_TEI, EXPORT_QUEUE);

    @Getter
    private final String name;

    @Getter
    private final String queue;

    KrameriusJobType(String name, String queue) {
        this.name = name;
        this.queue = queue;
    }

    @Override
    public String toString() {
        return name;
    }

    /**
     * Static constants to use as names. Works in annotations, needed for example to define bean names.
     */
    public static class KrameriusJobTypeName {
        public static final String CREATE_ENRICHMENT_REQUEST = "CREATE_ENRICHMENT_REQUEST";
        public static final String CREATE_EXPORT_REQUEST = "CREATE_EXPORT_REQUEST";

        public static final String ENRICHMENT_EXTERNAL = "ENRICHMENT_EXTERNAL";
        public static final String ENRICHMENT_NDK = "ENRICHMENT_NDK";
        public static final String ENRICHMENT_TEI = "ENRICHMENT_TEI";

        public static final String EXPORT_ALTO = "EXPORT_ALTO";
        public static final String EXPORT_TEXT = "EXPORT_TEXT";
        public static final String EXPORT_CSV = "EXPORT_CSV";
        public static final String EXPORT_JSON = "EXPORT_JSON";
        public static final String EXPORT_TEI = "EXPORT_TEI";

        public static final String MERGE_JOB = "MERGE_JOB";
    }

}
