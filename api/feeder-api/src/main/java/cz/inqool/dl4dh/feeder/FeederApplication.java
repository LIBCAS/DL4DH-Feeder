package cz.inqool.dl4dh.feeder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author Peter Sekan
 */
@EntityScan(basePackages = "cz.inqool.dl4dh.feeder")
@SpringBootApplication
@EnableScheduling
public class FeederApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeederApplication.class, args);
    }
}


