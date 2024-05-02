package cz.inqool.dl4dh.feeder.config;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.xml.Jaxb2XmlDecoder;
import org.springframework.http.codec.xml.Jaxb2XmlEncoder;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
@Slf4j
public class WebClientConfig {

    private static final int MAX_MEMORY_SIZE = 16777216;

    private WebClient.Builder prepareBuilder(String url) throws SSLException {
        SslContext sslContext = SslContextBuilder
                .forClient()
                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                .build();

        HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient)) // TODO: UNSAFE!! enable ssl
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(MAX_MEMORY_SIZE))
                .baseUrl(url)
                .filters(exchangeFilterFunctions -> {
                    exchangeFilterFunctions.add(logRequest());
                })
                .exchangeStrategies(ExchangeStrategies.builder().codecs((configurer) -> {
                            configurer.defaultCodecs().jaxb2Encoder(new Jaxb2XmlEncoder());
                            configurer.defaultCodecs().jaxb2Decoder(new Jaxb2XmlDecoder(MimeTypeUtils.TEXT_XML, MimeTypeUtils.TEXT_PLAIN)); })
                        .build());
    }

    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            if (log.isDebugEnabled()) {
                log.debug("WEBCLIENT REQUEST: {}", clientRequest.url());
            }
            return Mono.just(clientRequest);
        });
    }

    private WebClient getWebClient(String url) throws SSLException {
        return prepareBuilder(url).build();
    }

    private WebClient getWebClient(String url, String secret) throws SSLException {
        return prepareBuilder(url).defaultHeader("Authorization", "Feeder "+secret).build();
    }

    @Bean(name = "krameriusWebClient")
    public WebClient webClientKramerius(@Value("${system.kramerius.api}") String krameriusApi) throws SSLException {
        return getWebClient(krameriusApi+"/api/v5.0");
    }

    @Bean(name = "krameriusZoomifyWebClient")
    public WebClient webClientKrameriusZoomify(@Value("${system.kramerius.api}") String krameriusApi) throws SSLException {
        return getWebClient(krameriusApi+"/zoomify");
    }

    @Bean(name = "krameriusPrintWebClient")
    public WebClient webClientKrameriusPrint(@Value("${system.kramerius.api}") String krameriusApi) throws SSLException {
        return getWebClient(krameriusApi+"/localPrintPDF");
    }

    @Bean(name = "krameriusPlusWebClient")
    public WebClient webClientKrameriusPlus(@Value("${system.kramerius-plus.api}") String krameriusPlusApi, @Value("${system.kramerius-plus.secret}") String secret) throws SSLException {
        return getWebClient(krameriusPlusApi, secret);
    }

    @Bean(name = "solrWebClient")
    public WebClient webClientSolr(@Value("${solr.host.query}") String solrApi) throws SSLException {
        return getWebClient(solrApi);
    }
}
