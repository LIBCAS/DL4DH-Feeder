package cz.inqool.dl4dh.feeder.dto.openapi;

import cz.inqool.dl4dh.feeder.dto.kramerius.CollectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.Map;

@Getter
public class OpenAPIAvailableFilters {

    private Model models;
    private Enrichment enrichment;
    private Keywords keywords;
    private Languages languages;
    private Collections collections;
    private Availability availability;
    private Years years;
    private Authors authors;

    @Getter
    static class Model {
        @Schema(example = "3961")
        private Integer map;

        @Schema(example = "251086")
        private Integer monograph;

        @Schema(example = "4961")
        private Integer periodical;

        @Schema(example = "1023")
        private Integer sheetmusic;
    }

    @Getter
    static class Enrichment {
        @Schema(example = "261038", name = "ALL")
        private Integer all;

        @Schema(example = "261022", name = "NOT_ENRICHED")
        private Integer not;

        @Schema(example = "16", name = "ENRICHED")
        private Integer enriched;
    }

    @Getter
    static class Keywords {
        @Schema(example = "367")
        private Integer accounting;

        @Schema(example = "846")
        private Integer anglictina;
    }

    @Getter
    static class Languages {
        @Schema(example = "208112")
        private Integer cze;

        @Schema(example = "30899")
        private Integer eng;
    }

    @Getter
    static class Collections {
        @Schema(implementation = CollectionDto.class, name = "vc:05ae4510-72d4-4027-8c7a-e28d3f6900fb")
        private Integer first;

        @Schema(implementation = CollectionDto.class, name = "vc:069d0e97-7f12-46e1-86af-fbc9cd6596df")
        private Integer second;
    }

    @Getter
    static class Availability {
        @Schema(example = "216812", name = "private")
        private Integer pri;

        @Schema(example = "44226", name = "public")
        private Integer pub;
    }

    @Getter
    static class Years {
        @Schema(example = "24755", name = "0")
        private Integer first;

        @Schema(example = "55", name = "1772")
        private Integer second;
    }

    @Getter
    static class Authors {
        @Schema(example = "136", name = "Aleš, Mikoláš")
        private Integer first;

        @Schema(example = "151", name = "Arbes, Jakub")
        private Integer second;
    }
}
