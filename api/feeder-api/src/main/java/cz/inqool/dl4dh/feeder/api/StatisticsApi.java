package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.AvailabilityStatisticsDto;
import cz.inqool.dl4dh.feeder.dto.BasicStatisticsDto;
import cz.inqool.dl4dh.feeder.dto.DocumentTypeStatisticsDto;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/statistics")
public class StatisticsApi {

//    @Operation(summary = "Enrich a publication with given PID",
//            description = "This API enriches publications synchronously. It could cause response TimedOut on larger " +
//                    "publications, only for TESTING purposes. To enrich a publication asynchronously, use the SchedulerApi"
//    )
    @GetMapping(value = "/")
    public BasicStatisticsDto basicStatistics() {
        return new BasicStatisticsDto(
                new AvailabilityStatisticsDto(79213, 5124),
                new DocumentTypeStatisticsDto(1497, 8131, 609, 17, 138, 734));
    }
}
