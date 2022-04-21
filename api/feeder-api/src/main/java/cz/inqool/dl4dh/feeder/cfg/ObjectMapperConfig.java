package cz.inqool.dl4dh.feeder.cfg;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

/**
 * @author Norbert Bodnar
 */
@Configuration
public class ObjectMapperConfig {


    /**
     * Produces Jackson {@link ObjectMapper} used for JSON serialization/deserialization.
     *
     * <p>
     * {@link ObjectMapper} is used behind the scenes in Spring MVC object mapping, but can also be used by developer if
     * serialization/deserialization is needed in place.
     * </p>
     *
     * @param prettyPrint    Should the JSON be pretty-printed
     * @param serializeNulls Should the nulls be serialized or skipped
     * @return Produced {@link ObjectMapper}
     */
    @Bean
    public ObjectMapper objectMapper(@Value("${system.json.prettyPrint:true}") Boolean prettyPrint,
                                     @Value("${system.json.serializeNulls:false}") Boolean serializeNulls,
                                     @Value("${system.timezone:Europe/Prague}") TimeZone timeZone) {

        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.setTimeZone(timeZone);
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        if (prettyPrint != null && prettyPrint) {
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        }

        if (serializeNulls != null && !serializeNulls) {
            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        }

        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

        return objectMapper;
    }
}
