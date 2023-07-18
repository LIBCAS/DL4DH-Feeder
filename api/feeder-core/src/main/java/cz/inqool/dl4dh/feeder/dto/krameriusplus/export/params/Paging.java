package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Paging {

    /**
     * Paging current page
     */
    @Schema(defaultValue = "0", description = "Paging current page")
    private int page = 0;

    /**
     * Paging size
     */
    @Schema(defaultValue = "10", description = "Paging size")
    private int pageSize = 10;
}

