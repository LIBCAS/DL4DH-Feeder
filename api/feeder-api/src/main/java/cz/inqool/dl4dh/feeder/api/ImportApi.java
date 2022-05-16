package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.*;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryResponseDto;
import cz.inqool.dl4dh.feeder.kramerius.dto.SolrQueryWithFacetResponseDto;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/import")
public class ImportApi {

    private WebClient kramerius;

    private final HttpSolrClient solr;

    public ImportApi(@Value("${solr.host.query}") String solrHost) {
        this.solr = new HttpSolrClient.Builder(solrHost.trim()).build();
    }

    @PostMapping(value = "")
    public int importDocument(@RequestBody KrameriusPlusDocumentDto document) throws SolrServerException, IOException {
        List<SolrObjectDto> newObjects = new ArrayList<>();
        newObjects.add(new SolrObjectDto(document.getId(), document.getId()));

        for (KrameriusPlusDocumentPageDto page : document.getPages()) {
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

        int all = 0;
        for (SolrObjectDto solrObjectDto : newObjects) {
            SolrQueryResponseDto result = kramerius.get()
                    .uri("/search", uriBuilder -> uriBuilder
                            .queryParam("fl", "PID,dostupnost,fedora.model,dc.creator,dc.title,datum_begin,keywords,language,collection")
                            .queryParam("q", "PID:"+solrObjectDto.getPID().replace(":","\\:"))
                            .queryParam("rows", "1")
                            .build())
                    .acceptCharset(StandardCharsets.UTF_8)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(SolrQueryResponseDto.class)
                    .block();
            if (result.getResponse().getDocs().stream().findFirst().isPresent()) {
                Map<String, Object> values = result.getResponse().getDocs().stream().findFirst().get();
                solrObjectDto.setModel((String)values.get("fedora.model"));
                solrObjectDto.setDostupnost((String)values.get("dostupnost"));
                solrObjectDto.setTitle((String)values.get("dc.title"));
                solrObjectDto.setDatum_begin((Integer)values.getOrDefault("datum_begin", null));
                solrObjectDto.setKeywords((ArrayList<String>)values.getOrDefault("keywords",new ArrayList<>()));
                solrObjectDto.setLanguage((ArrayList<String>)values.getOrDefault("language",new ArrayList<>()));
                solrObjectDto.setCollection((ArrayList<String>)values.getOrDefault("collection",new ArrayList<>()));
                solrObjectDto.setCreator((ArrayList<String>)values.getOrDefault("dc.creator",new ArrayList<>()));
            }

            solr.addBean(solrObjectDto);
            all += 1;
            if (all % 10 == 0) {
                solr.commit();
            }
        }
        solr.commit();
        return all;
    }

    @Resource(name = "krameriusWebClient")
    public void setWebClient(WebClient webClient) {
        this.kramerius = webClient;
    }
}
