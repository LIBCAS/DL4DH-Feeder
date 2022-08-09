package cz.inqool.dl4dh.feeder;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
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
@OpenAPIDefinition(info = @Info(title = "DL4DH Feeder APIs", version = "${info.app.version:unknown}", description = "API endpoints"))
public class FeederApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeederApplication.class, args);
    }
}


