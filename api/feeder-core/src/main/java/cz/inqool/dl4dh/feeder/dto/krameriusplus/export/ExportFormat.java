package cz.inqool.dl4dh.feeder.dto.krameriusplus.export;

import lombok.Getter;

public enum ExportFormat {
    JSON("json"),
    TEI("xml"),
    CSV("csv"),
    ALTO("xml"),
    TEXT("txt");

    @Getter
    private final String suffix;

    ExportFormat(String fileSuffix) {
        this.suffix = fileSuffix;
    }
}
