package cz.inqool.dl4dh.feeder.dto.openapi;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class OpenAPIAvailableNameTagFilters {

    private ExampleNameTagFilter institutions;
    private ExampleNameTagFilter geographicalNames;
    private ExampleNameTagFilter mediaNames;
    private ExampleNameTagFilter personalNames;
    private ExampleNameTagFilter complexPersonNames;
    private ExampleNameTagFilter complexTimeExpression;
    private ExampleNameTagFilter numbersInAddresses;
    private ExampleNameTagFilter numberExpressions;
    private ExampleNameTagFilter complexAddressExpression;
    private ExampleNameTagFilter complexBiblioExpression;
    private ExampleNameTagFilter artifactNames;
    private ExampleNameTagFilter timeExpression;

    @Getter
    static class ExampleNameTagFilter {
        @Schema(example = "136", name = "Abraham")
        private Integer first;

        @Schema(example = "151", name = "1898")
        private Integer second;
    }
}
