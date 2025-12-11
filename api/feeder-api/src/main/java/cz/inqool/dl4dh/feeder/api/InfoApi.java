package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/info")
public class InfoApi {

    private final InfoDto info;

    public InfoApi(InfoDto info) {
        this.info = info;
    }

    @Operation(summary = "Information about the system, version, connected Kramerius+ and Kramerius versions.")
    @GetMapping
    public InfoDto info() {
        return info;
    }
}
