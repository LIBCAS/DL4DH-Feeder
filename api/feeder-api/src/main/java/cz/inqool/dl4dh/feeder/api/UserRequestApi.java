package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.Result;
import cz.inqool.dl4dh.feeder.dto.request.*;
import cz.inqool.dl4dh.feeder.dto.request.message.MessageCreateDto;
import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import cz.inqool.dl4dh.feeder.enums.UserRequestType;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Principal;


/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/user-requests")
public class UserRequestApi {

    private WebClient krameriusPlus;

    @Operation(summary = "Create a user request")
    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserRequestDto createUserRequest(@Valid @ModelAttribute UserRequestCreateDto createDto,
                                            @RequestParam(name = "files", required = false) MultipartFile[] multipartFiles,
                                            @RequestHeader(value = "Authorization") String token) throws IOException {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        if (multipartFiles != null) {
            for (MultipartFile file : multipartFiles) {
                builder.part("files", file.getResource())
                        .header("Content-Type", file.getContentType())
                        .header("Content-Disposition", "form-data; name=\""+file.getName()+"\"; filename=\""+file.getOriginalFilename()+"\"");
            }
        }
        builder.part("message", createDto.getMessage());
        builder.part("type", createDto.getType().toString());
        if (createDto.getPublicationIds() != null) {
            for (String publicationId : createDto.getPublicationIds()) {
                builder.part("publicationIds", publicationId);
            }
        }
        return krameriusPlus.post()
                .uri("/user-requests/")
                .header("Authorization", token).body(BodyInserters.fromMultipartData(builder.build())).retrieve().bodyToMono(UserRequestDto.class).block();

    }

    @Operation(summary = "Get list of user requests")
    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public Result<UserRequestListDto> userRequest(Principal principal,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
                                                  @RequestParam(value = "year", required = false) Integer year,
                                                  @RequestParam(value = "identification", required = false) Integer identification,
                                                  @RequestParam(value = "state", required = false) UserRequestState state,
                                                  @RequestParam(value = "type", required = false) UserRequestType type,
                                                  @RequestParam(value = "sortOrder", defaultValue = "DESC") Sort.Order order,
                                                  @RequestParam(value = "sortField", defaultValue = "CREATED") Sort.Field field,
                                                  @RequestHeader(value = "Authorization") String token) {
        return krameriusPlus.get()
                .uri("/user-requests/", uriBuilder -> {
                    if (year != null) uriBuilder.queryParam("page", page);
                    if (identification != null) uriBuilder.queryParam("identification", identification);
                    if (state != null) uriBuilder.queryParam("state", state);
                    if (type != null) uriBuilder.queryParam("type", type);
                    if (order != null) uriBuilder.queryParam("sortOrder", order);
                    if (field != null) uriBuilder.queryParam("sortField", field);
                    uriBuilder.queryParam("username", principal.getName());
                    return uriBuilder.build();
                })
                .header("Authorization", token)
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve().bodyToMono(new ParameterizedTypeReference<Result<UserRequestListDto>>() {}).block();
    }

    @Operation(summary = "Get a user request detail")
    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/{requestId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserRequestDto> findUserRequest(@PathVariable String requestId, @RequestHeader(value = "Authorization") String token) {
        try {
            return ResponseEntity.ok().body(krameriusPlus.get()
                .uri("/user-requests/"+requestId)
                .header("Authorization", token)
                .retrieve().bodyToMono(UserRequestDto.class).block());
        }
        catch (WebClientResponseException.NotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Download a file from a user request")
    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/{requestId}/file/{fileId}")
    public @ResponseBody ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String requestId,
                                                                        @PathVariable String fileId,
                                                                        @RequestHeader(value = "Authorization") String token) {
        // Get the stream
        ResponseEntity<ByteArrayResource> entity = krameriusPlus.get().uri("/user-requests/"+requestId+"/file/"+fileId)
                .header("Authorization", token).retrieve().toEntity(ByteArrayResource.class).block();
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource body = entity.getBody();

        // Get correct media type
        MediaType mediaType = MediaType.TEXT_PLAIN;
        try {
            if (entity.getHeaders().getContentType() != null) {
                mediaType = entity.getHeaders().getContentType();
            }
        }
        catch (Exception ex) {
            // OK
        }
        return ResponseEntity.ok().contentType(mediaType).body(body);
    }

    @Operation(summary = "Create a new message in a user request")
    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/{requestId}/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createMessage(@PathVariable String requestId,
                                              @Valid @ModelAttribute MessageCreateDto messageCreateDto,
                                              @RequestParam(value = "files", required = false) MultipartFile[] multipartFiles,
                                              @RequestHeader(value = "Authorization") String token) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        if (multipartFiles != null) {
            for (MultipartFile file : multipartFiles) {
                builder.part("files", file.getResource())
                        .header("Content-Type", file.getContentType())
                        .header("Content-Disposition", "form-data; name=\""+file.getName()+"\"; filename=\""+file.getOriginalFilename()+"\"");
            }
        }
        builder.part("message", messageCreateDto.getMessage());
        return krameriusPlus.post()
                .uri("/user-requests/"+requestId+"/message")
                .header("Authorization", token).body(BodyInserters.fromMultipartData(builder.build())).retrieve().toBodilessEntity().block();
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
