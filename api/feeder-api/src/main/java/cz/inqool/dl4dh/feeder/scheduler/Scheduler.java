package cz.inqool.dl4dh.feeder.scheduler;

import cz.inqool.dl4dh.feeder.service.ImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {
    private static final Logger log = LoggerFactory.getLogger(Scheduler.class);

    private final ImportService importService;

    public Scheduler(ImportService importService) {
        this.importService = importService;
    }

    @Scheduled(fixedDelay = 60000, initialDelay = 3000)
    public void scheduleHarvestsSync() {
        log.info("SCHEDULER STARTS");
        importService.sync();
        log.info("SCHEDULER ENDS");
    }
}
