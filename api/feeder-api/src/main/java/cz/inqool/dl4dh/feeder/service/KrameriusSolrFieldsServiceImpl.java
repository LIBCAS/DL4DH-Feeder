package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.info.InfoDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class KrameriusSolrFieldsServiceImpl {

    KrameriusSolrFieldsService krameriusService;
    public KrameriusSolrFieldsServiceImpl(InfoDto infoDto) {
        if (infoDto.isVersion7()) {
            krameriusService = new Kramerius7SolrFieldsServiceImpl();
        }
        else {
            krameriusService = new Kramerius5SolrFieldsServiceImpl();
        }
    }

    @Bean(name = "krameriusSolrFields")
    public KrameriusSolrFieldsService krameriusService() {
        return krameriusService;
    }
}
