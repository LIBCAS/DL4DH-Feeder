package cz.inqool.dl4dh.feeder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * @author Peter Sekan
 */
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(basePackages = "cz.inqool.dl4dh.feeder")
public class FeederApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeederApplication.class, args);
    }
}
