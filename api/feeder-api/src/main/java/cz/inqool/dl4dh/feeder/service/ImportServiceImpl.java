package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.model.Setting;
import cz.inqool.dl4dh.feeder.repository.SettingRepository;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ImportServiceImpl implements ImportService {
    private static final Logger log = LoggerFactory.getLogger(ImportService.class);
    private static final String LAST_SYNC_DATE_KEY = "LAST_SYNC";

    private WebClient kramerius;
    private WebClient krameriusPlus;
    private SettingRepository settingRepository;
    private final HttpSolrClient solr;

    public ImportServiceImpl(@Value("${solr.host.query}") String solrHost) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @Override
    public void sync() {
        Setting lastSync = settingRepository.findById(LAST_SYNC_DATE_KEY).orElse(new Setting(LAST_SYNC_DATE_KEY, "2022-01-01T00:00:00.000"));

        LocalDateTime currentDate = LocalDateTime.now();
        List<KrameriusPlusDocumentDto> publications = krameriusPlus.get()
                .uri("/publications/list/published?modifiedAfter="+lastSync.getValue())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KrameriusPlusDocumentDto>>() {})
                .block();

        log.info("Syncing from "+lastSync.getValue()+" to "+currentDate+", found "+publications.size() + " publications.");

        int imported = 0;
        for (KrameriusPlusDocumentDto publication : publications) {
            try {
                if (publication.getPublishInfo().getIsPublished()) {
                    imported += importDocument(publication);
                }
            }
            catch (Exception ex) {
                log.error("Cannot import publication "+publication.getId(), ex);
                return;
            }
        }
        log.info("Imported "+imported+" pages");

        lastSync.setValue(currentDate.toString());

        settingRepository.saveAndFlush(lastSync);
    }

    private int importDocument(KrameriusPlusDocumentDto document) throws SolrServerException, IOException {
        List<SolrObjectDto> newObjects = new ArrayList<>();
        newObjects.add(new SolrObjectDto(document.getId(), document.getId()));

        int pageCounter = 0;
        int all = 0;
        while (true) {
            KrameriusPlusDocumentPagesGetDto pages = krameriusPlus.get()
                    .uri("/publications/" + document.getId() + "/pages?page=" + pageCounter)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<KrameriusPlusDocumentPagesGetDto>() {
                    })
                    .block();
            if (pages == null) {
                throw new RuntimeException("Cannot load pages for publication " + document.getId());
            }

            for (KrameriusPlusDocumentPageDto pageBase : pages.getResults()) {
                KrameriusPlusDocumentPageDto page = krameriusPlus.get()
                        .uri("/publications/" + document.getId() + "/pages/" + pageBase.getId())
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<KrameriusPlusDocumentPageDto>() {
                        })
                        .block();
                if (page == null) {
                    throw new RuntimeException("Cannot load page with id " + pageBase.getId());
                }

                SolrObjectDto newObject = new SolrObjectDto(page.getId(), document.getId());
                if (page.getNameTagMetadata() != null && page.getNameTagMetadata().getNamedEntities() != null) {
                    for (Map.Entry<String, List<KrameriusPlusDocumentNameTagEntityDto>> entityType : page.getNameTagMetadata().getNamedEntities().entrySet()) {
                        for (KrameriusPlusDocumentNameTagEntityDto entity : entityType.getValue()) {
                            String text = entity.getTokens().stream()
                                    .map(t -> t.getLinguisticMetadata().getLemma())
                                    .collect(Collectors.joining(" ", " ", " "))
                                    .replace(" . ", ". ")
                                    .trim();
                            switch (NameTagEntityType.fromString(entity.getEntityType())) {
                                case NUMBERS_IN_ADDRESSES:
                                    newObject.getNumbersInAddresses().add(text);
                                    break;
                                case GEOGRAPHICAL_NAMES:
                                    newObject.getGeographicalNames().add(text);
                                    break;
                                case INSTITUTIONS:
                                    newObject.getInstitutions().add(text);
                                    break;
                                case MEDIA_NAMES:
                                    newObject.getMediaNames().add(text);
                                    break;
                                case NUMBER_EXPRESSIONS:
                                    newObject.getNumberExpressions().add(text);
                                    break;
                                case ARTIFACT_NAMES:
                                    newObject.getArtifactNames().add(text);
                                    break;
                                case PERSONAL_NAMES:
                                    newObject.getPersonalNames().add(text);
                                    break;
                                case TIME_EXPRESSIONS:
                                    newObject.getTimeExpression().add(text);
                                    break;
                                case COMPLEX_PERSON_NAMES:
                                    newObject.getComplexPersonNames().add(text);
                                    break;
                                case COMPLEX_TIME_EXPRESSION:
                                    newObject.getComplexTimeExpression().add(text);
                                    break;
                                case COMPLEX_ADDRESS_EXPRESSION:
                                    newObject.getComplexAddressExpression().add(text);
                                    break;
                                case COMPLEX_BIBLIO_EXPRESSION:
                                    newObject.getComplexBiblioExpression().add(text);
                                    break;
                            }
                        }
                    }
                }
                newObjects.add(newObject);
            }

            for (SolrObjectDto solrObjectDto : newObjects) {
                SolrQueryResponseDto result = kramerius.get()
                        .uri("/search", uriBuilder -> uriBuilder
                                .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,datum_begin,datum_end,keywords,language,collection,created_date,title_sort")
                                .queryParam("q", "PID:" + solrObjectDto.getPID().replace(":", "\\:"))
                                .queryParam("rows", "1")
                                .build())
                        .acceptCharset(StandardCharsets.UTF_8)
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(SolrQueryResponseDto.class)
                        .block();
                if (result.getResponse().getDocs().stream().findFirst().isPresent()) {
                    Map<String, Object> values = result.getResponse().getDocs().stream().findFirst().get();
                    String created_date = (String) values.getOrDefault("created_date", null);
                    solrObjectDto.setModel((String) values.get("fedora.model"));
                    solrObjectDto.setDostupnost((String) values.get("dostupnost"));
                    solrObjectDto.setTitle((String) values.get("dc.title"));
                    solrObjectDto.setDatum_begin((Integer) values.getOrDefault("datum_begin", null));
                    solrObjectDto.setDatum_end((Integer) values.getOrDefault("datum_end", null));
                    solrObjectDto.setCreated_date(created_date);
                    solrObjectDto.setImport_date(LocalDateTime.now().atOffset(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ssX")));
                    solrObjectDto.setKeywords((ArrayList<String>) values.getOrDefault("keywords", new ArrayList<>()));
                    solrObjectDto.setLanguage((ArrayList<String>) values.getOrDefault("language", new ArrayList<>()));
                    solrObjectDto.setCollection((ArrayList<String>) values.getOrDefault("collection", new ArrayList<>()));
                    solrObjectDto.setCreator((ArrayList<String>) values.getOrDefault("dc.creator", new ArrayList<>()));
                }

                solr.addBean(solrObjectDto);
                all += 1;
                if (all % 10 == 0) {
                    solr.commit();
                }
            }

            if (pages.getOffset()+pages.getLimit() >= pages.getTotal()) {
                break;
            }
            pageCounter += 1;
        }
        solr.commit();
        return all;
    }

    @Resource
    public void setSettingRepository(SettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebPlusClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
