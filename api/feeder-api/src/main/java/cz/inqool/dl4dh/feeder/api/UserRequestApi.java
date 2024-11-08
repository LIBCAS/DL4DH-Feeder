package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.Result;
import cz.inqool.dl4dh.feeder.dto.request.*;
import cz.inqool.dl4dh.feeder.dto.request.message.MessageCreateDto;
import cz.inqool.dl4dh.feeder.enums.UserRequestState;
import cz.inqool.dl4dh.feeder.enums.UserRequestType;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.security.Principal;


/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/user-requests")
public class UserRequestApi {

    private WebClient krameriusPlus;

    @PostMapping(value = "/")
    public UserRequestDto createUserRequest(@Valid @ModelAttribute UserRequestCreateDto createDto,
                                                            @RequestParam("files") MultipartFile[] multipartFiles) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("files", multipartFiles);
        builder.part("message", createDto.getMessage());
        builder.part("type", createDto.getType());
        builder.part("publicationIds", createDto.getPublicationIds());
        return krameriusPlus.post()
                .uri("/user-requests/").body(BodyInserters.fromMultipartData(builder.build())).retrieve().bodyToMono(UserRequestDto.class).block();

    }

    @GetMapping("/")
    public Result<UserRequestListDto> userRequest(Principal principal,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
                                                  @RequestParam(value = "year", required = false) Integer year,
                                                  @RequestParam(value = "identification", required = false) Integer identification,
                                                  @RequestParam(value = "state", required = false) UserRequestState state,
                                                  @RequestParam(value = "type", required = false) UserRequestType type,
                                                  @RequestParam(value = "username", required = false) String username,
                                                  @RequestParam(value = "sortOrder", defaultValue = "DESC") Sort.Order order,
                                                  @RequestParam(value = "sortField", defaultValue = "CREATED") Sort.Field field,
                                                  @RequestParam(value = "rootFilterOperation", defaultValue = "AND") ListFilterDto.RootFilterOperation operation,
                                                  @RequestParam(value = "viewDeleted", defaultValue = "false") boolean viewDeleted) {
        return krameriusPlus.get()
                .uri("/user-requests", uriBuilder -> uriBuilder
                        .queryParam("page", page)
                        .queryParam("pageSize", pageSize)
                        .queryParam("year", year)
                        .queryParam("identification", identification)
                        .queryParam("state", state)
                        .queryParam("type", type)
                        .queryParam("username", principal.getName())
                        .queryParam("sortOrder", order)
                        .queryParam("sortField", field)
                        .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve().bodyToMono(new ParameterizedTypeReference<Result<UserRequestListDto>>() {}).block();
    }

    @GetMapping("/{requestId}")
    public UserRequestDto findUserRequest(@PathVariable String requestId) {
        return krameriusPlus.get()
                .uri("/user-requests/"+requestId).retrieve().bodyToMono(UserRequestDto.class).block();
    }

    @GetMapping("/{requestId}/file/{fileId}")
    public @ResponseBody ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String requestId, @PathVariable String fileId) {

        // Get the stream
        ResponseEntity<ByteArrayResource> entity = krameriusPlus.get().uri("/user-requests/"+requestId+"/file/"+fileId).retrieve().toEntity(ByteArrayResource.class).block();
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

    @PostMapping(value = "/{requestId}/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createMessage(@PathVariable String requestId,
                                              @Valid @ModelAttribute MessageCreateDto messageCreateDto,
                                              @RequestParam(value = "files", required = false) MultipartFile[] multipartFiles) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("files", multipartFiles);
        builder.part("message", messageCreateDto.getMessage());
        return krameriusPlus.post()
                .uri("/user-requests/"+requestId+"/message").body(BodyInserters.fromMultipartData(builder.build())).retrieve().toBodilessEntity().block();
    }

    @Resource(name = "krameriusPlusWebClient")
    public void setWebClient(WebClient webClient) {
        this.krameriusPlus = webClient;
    }
}
