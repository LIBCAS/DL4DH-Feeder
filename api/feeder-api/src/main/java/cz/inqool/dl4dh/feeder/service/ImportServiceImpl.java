package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.krameriusplus.document.KrameriusPlusDocumentDto;
import cz.inqool.dl4dh.feeder.krameriusplus.document.KrameriusPlusDocumentNameTagEntityDto;
import cz.inqool.dl4dh.feeder.krameriusplus.document.KrameriusPlusDocumentPageDto;
import cz.inqool.dl4dh.feeder.krameriusplus.document.KrameriusPlusPaging;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.model.Setting;
import cz.inqool.dl4dh.feeder.repository.SettingRepository;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ImportServiceImpl implements ImportService {
    private static final Logger log = LoggerFactory.getLogger(ImportService.class);
    private static final String LAST_SYNC_DATE_KEY = "LAST_SYNC";
    private static final String LAST_SYNC_PAGE_KEY = "LAST_SYNC_PAGE";

    private WebClient kramerius;
    private WebClient krameriusPlus;
    private SettingRepository settingRepository;
    private final String solrHost;
    private final KrameriusSolrFieldsService solrFields;
    private final List<String> publicPolicies;

    public ImportServiceImpl(@Value("${solr.host.query}") String solrHost, @Qualifier("krameriusSolrFields")  KrameriusSolrFieldsService solrFields, @Value("${system.kramerius.publicPolicies}") String publicPolicies) {
        this.solrHost = solrHost;
        this.solrFields = solrFields;
        this.publicPolicies = List.of(publicPolicies.split(","));
    }

    @Override
    public void sync() {
        Setting lastSync = settingRepository.findById(LAST_SYNC_DATE_KEY).orElse(new Setting(LAST_SYNC_DATE_KEY, "2022-01-01T00:00:00.000"));
        Setting lastPage = settingRepository.findById(LAST_SYNC_PAGE_KEY).orElse(new Setting(LAST_SYNC_PAGE_KEY, "0"));

        ZonedDateTime currentDate = ZonedDateTime.now(ZoneOffset.UTC);
        int page = Integer.parseInt(lastPage.getValue());
        KrameriusPlusPaging<KrameriusPlusDocumentDto> publications;
        do  {
            publications = krameriusPlus.get()
                    .uri("/publications/list/published?pageSize=10&page="+page+"&modifiedAfter="+lastSync.getValue().replace("Z", ""))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<KrameriusPlusPaging<KrameriusPlusDocumentDto>>() {})
                    .block();

            assert publications != null;
            int publicationsOnPage = publications.getItems().size();
            log.info("Syncing from "+lastSync.getValue()+" to "+currentDate+", found "+publicationsOnPage+" of "+publications.getTotal() + " publications on page "+ page +".");

            AtomicInteger crashed = new AtomicInteger(0);
            ExecutorService es = Executors.newFixedThreadPool(2);
            publications.getItems().stream().map(publication -> new ImportDocumentThread(publication, kramerius, krameriusPlus, solrHost, crashed, solrFields, publicPolicies)).forEach(es::execute);
            es.shutdown();
            try {
                es.awaitTermination(60, TimeUnit.MINUTES);
            }
            catch (Exception ex) {
                log.error("An error occured during execution of sync threads: "+ex.getMessage());
                throw new RuntimeException(ex);
            }

            if (crashed.get() > 0) {
                log.error("More than one thread crashed, stopping syncing.");
                throw new RuntimeException("More than one thread crashed, stopping syncing.");
            }

            page += 1;
            lastPage.setValue(String.valueOf(page));
            settingRepository.saveAndFlush(lastPage);
        } while ((10*page <= publications.getTotal()));

        lastPage.setValue("0");
        settingRepository.saveAndFlush(lastPage);

        lastSync.setValue(currentDate.toString());
        settingRepository.saveAndFlush(lastSync);
    }

    private static class ImportDocumentThread implements Runnable {
        private final KrameriusPlusDocumentDto document;
        private final WebClient kramerius;
        private final WebClient krameriusPlus;
        private final HttpSolrClient solr;
        private final AtomicInteger crashed;
        private final KrameriusSolrFieldsService solrFields;
        private final List<String> publicPolicies;

        public ImportDocumentThread(KrameriusPlusDocumentDto document, WebClient kramerius, WebClient krameriusPlus, String solrHost, AtomicInteger crashed, @Qualifier("krameriusSolrFields")  KrameriusSolrFieldsService solrFields, List<String> publicPolicies) {
            this.document = document;
            this.kramerius = kramerius;
            this.krameriusPlus = krameriusPlus;
            this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
            this.crashed = crashed;
            this.solrFields = solrFields;
            this.publicPolicies = publicPolicies;
        }

        public void run() {
            int pageCounter = 0;
            int imported = 0;
            int removed = 0;
            int all = 0;

            try {
                log.info("Start syncing `"+document.getTitle()+"` ["+document.getId()+"].");

                List<SolrObjectDto> newObjects = new ArrayList<>();
                SolrObjectDto rootDocument = null;
                if (document.getPublishInfo().getIsPublished() == null || !document.getPublishInfo().getIsPublished()) {
                    solr.deleteById(document.getId());
                    removed += 1;
                    all += 1;
                }
                else {
                    rootDocument = new SolrObjectDto(document.getId(), document.getId());
                    newObjects.add(rootDocument);
                }


                while (true) {
                    KrameriusPlusPaging<KrameriusPlusDocumentPageDto> pages = krameriusPlus.get()
                            .uri("/publications/" + document.getId() + "/pages?page="+pageCounter)
                            .retrieve()
                            .bodyToMono(new ParameterizedTypeReference<KrameriusPlusPaging<KrameriusPlusDocumentPageDto>>() {
                            })
                            .block();
                    if (pages == null) {
                        throw new RuntimeException("Cannot load pages for publication " + document.getId());
                    }

                    for (KrameriusPlusDocumentPageDto pageBase : pages.getItems()) {
                        if (document.getPublishInfo().getIsPublished() == null || !document.getPublishInfo().getIsPublished()) {
                            solr.deleteById(pageBase.getId());
                            removed += 1;
                            all += 1;
                            if (all % 10 == 0) {
                                solr.commit();
                            }
                            continue;
                        }

                        KrameriusPlusDocumentPageDto page = krameriusPlus.get()
                                .uri("/publications/pages/" + pageBase.getId())
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
                                            if (rootDocument != null && !rootDocument.getNumbersInAddresses().contains(text)) {
                                                rootDocument.getNumbersInAddresses().add(text);
                                            }
                                            break;
                                        case GEOGRAPHICAL_NAMES:
                                            newObject.getGeographicalNames().add(text);
                                            if (rootDocument != null && !rootDocument.getGeographicalNames().contains(text)) {
                                                rootDocument.getGeographicalNames().add(text);
                                            }
                                            break;
                                        case INSTITUTIONS:
                                            newObject.getInstitutions().add(text);
                                            if (rootDocument != null && !rootDocument.getInstitutions().contains(text)) {
                                                rootDocument.getInstitutions().add(text);
                                            }
                                            break;
                                        case MEDIA_NAMES:
                                            newObject.getMediaNames().add(text);
                                            if (rootDocument != null && !rootDocument.getMediaNames().contains(text)) {
                                                rootDocument.getMediaNames().add(text);
                                            }
                                            break;
                                        case NUMBER_EXPRESSIONS:
                                            newObject.getNumberExpressions().add(text);
                                            if (rootDocument != null && !rootDocument.getNumberExpressions().contains(text)) {
                                                rootDocument.getNumberExpressions().add(text);
                                            }
                                            break;
                                        case ARTIFACT_NAMES:
                                            newObject.getArtifactNames().add(text);
                                            if (rootDocument != null && !rootDocument.getArtifactNames().contains(text)) {
                                                rootDocument.getArtifactNames().add(text);
                                            }
                                            break;
                                        case PERSONAL_NAMES:
                                            newObject.getPersonalNames().add(text);
                                            if (rootDocument != null && !rootDocument.getPersonalNames().contains(text)) {
                                                rootDocument.getPersonalNames().add(text);
                                            }
                                            break;
                                        case TIME_EXPRESSIONS:
                                            newObject.getTimeExpression().add(text);
                                            if (rootDocument != null && !rootDocument.getTimeExpression().contains(text)) {
                                                rootDocument.getTimeExpression().add(text);
                                            }
                                            break;
                                        case COMPLEX_PERSON_NAMES:
                                            newObject.getComplexPersonNames().add(text);
                                            if (rootDocument != null && !rootDocument.getComplexPersonNames().contains(text)) {
                                                rootDocument.getComplexPersonNames().add(text);
                                            }
                                            break;
                                        case COMPLEX_TIME_EXPRESSION:
                                            newObject.getComplexTimeExpression().add(text);
                                            if (rootDocument != null && !rootDocument.getComplexTimeExpression().contains(text)) {
                                                rootDocument.getComplexTimeExpression().add(text);
                                            }
                                            break;
                                        case COMPLEX_ADDRESS_EXPRESSION:
                                            newObject.getComplexAddressExpression().add(text);
                                            if (rootDocument != null && !rootDocument.getComplexAddressExpression().contains(text)) {
                                                rootDocument.getComplexAddressExpression().add(text);
                                            }
                                            break;
                                        case COMPLEX_BIBLIO_EXPRESSION:
                                            newObject.getComplexBiblioExpression().add(text);
                                            if (rootDocument != null && !rootDocument.getComplexBiblioExpression().contains(text)) {
                                                rootDocument.getComplexBiblioExpression().add(text);
                                            }
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
                                        .queryParam("fl", String.join(",",
                                                solrFields.pid(),
                                                solrFields.rootPid(),
                                                solrFields.parentPid(),
                                                solrFields.accessibility(),
                                                solrFields.model(),
                                                solrFields.author(),
                                                solrFields.title(),
                                                solrFields.dateFrom(),
                                                solrFields.dateTo(),
                                                solrFields.date(),
                                                solrFields.keywords(),
                                                solrFields.language(),
                                                solrFields.collection(),
                                                solrFields.created(),
                                                solrFields.titleSort(),
                                                solrFields.authorFacet(),
                                                solrFields.modelPath()))
                                        .queryParam("q", solrFields.pid()+":" + solrObjectDto.getPID().replace(":", "\\:"))
                                        .queryParam("rows", "1")
                                        .build())
                                .acceptCharset(StandardCharsets.UTF_8)
                                .accept(MediaType.APPLICATION_JSON)
                                .retrieve()
                                .bodyToMono(SolrQueryResponseDto.class)
                                .block();
                        if (result.getResponse().getDocs().stream().findFirst().isPresent()) {
                            Map<String, Object> values = result.getResponse().getDocs().stream().findFirst().get();
                            String created_date = (String) values.getOrDefault(solrFields.created(), null);
                            solrObjectDto.setRootTitle((String) values.get(solrFields.rootTitle()));
                            solrObjectDto.setParent_pid(transformStringToArray(values.getOrDefault(solrFields.parentPid(), new ArrayList<>())));
                            solrObjectDto.setModel((String) values.get(solrFields.model()));
                            if (values.get(solrFields.accessibility()) instanceof List) {
                                List<String> accessibility = (List<String>) values.get(solrFields.accessibility());
                                solrObjectDto.setDostupnost(Collections.disjoint(accessibility, publicPolicies) ? "private" : "public");
                            }
                            else {
                                solrObjectDto.setDostupnost((String) values.get(solrFields.accessibility()));
                            }
                            solrObjectDto.setTitle((String) values.get(solrFields.title()));
                            solrObjectDto.setTitleSort((String) values.get(solrFields.titleSort()));
                            solrObjectDto.setDatum_begin(transformDate((values.getOrDefault(solrFields.dateFrom(), null))));
                            solrObjectDto.setDatum_end(transformDate(values.getOrDefault(solrFields.dateTo(), null)));
                            solrObjectDto.setDatum_str((String) values.get(solrFields.date()));
                            solrObjectDto.setCreated_date(created_date);
                            solrObjectDto.setImport_date(LocalDateTime.now().atOffset(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ssX")));
                            solrObjectDto.setFacet_autor(transformStringToArray(values.getOrDefault(solrFields.authorFacet(), new ArrayList<>())));
                            solrObjectDto.setModel_path(transformStringToArray(values.getOrDefault(solrFields.modelPath(), new ArrayList<>())));
                            solrObjectDto.setKeywords(transformStringToArray(values.getOrDefault(solrFields.keywords(), new ArrayList<>())));
                            solrObjectDto.setLanguage(transformStringToArray(values.getOrDefault(solrFields.language(), new ArrayList<>())));
                            solrObjectDto.setCollection(transformStringToArray(values.getOrDefault(solrFields.collection(), new ArrayList<>())));
                            solrObjectDto.setCreator(transformStringToArray(values.getOrDefault(solrFields.author(), new ArrayList<>())));
                        }

                        solr.addBean(solrObjectDto);
                        imported += 1;
                        all += 1;
                        if (all % 10 == 0) {
                            solr.commit();
                        }
                    }
                    newObjects.clear();

                    // Stop if pages were processed or more than 10 000 pages were processed
                    // (hard break if there is a bug on K+)
                    if ((pages.getPage()+1)*pages.getPageSize() >= Integer.min(pages.getTotal(), 10000)) {
                        break;
                    }
                    pageCounter += 1;
                }
                solr.commit();
                log.info("Synced `"+document.getTitle()+"` ["+document.getId()+"] with "+imported+" elements imported and "+removed+" elements removed.");
            }
            catch (Exception ex) {
                log.error("Cannot import publication "+document.getId(), ex);
                log.error(ex.toString());
                log.error(Arrays.toString(ex.getStackTrace()));
                crashed.incrementAndGet();
            }
        }

        private static Integer transformDate(Object value) {
            if (value instanceof String) {
                return Integer.parseInt((String) ((String) value).substring(0, 4));
            }
            return (Integer) value;
        }

        private static ArrayList<String> transformStringToArray(Object value) {
            if (value instanceof String) {
                ArrayList<String> result = new ArrayList<String>();
                result.add((String) value);
                return result;
            }
            return (ArrayList<String>)value;
        }
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
