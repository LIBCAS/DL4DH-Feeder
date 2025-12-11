package cz.inqool.dl4dh.feeder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class FeederSolrFieldsServiceImpl {
    @Bean(name = "feederSolrFields")
    public KrameriusSolrFieldsService krameriusService() {
        return new Kramerius5SolrFieldsServiceImpl();
    }
}
