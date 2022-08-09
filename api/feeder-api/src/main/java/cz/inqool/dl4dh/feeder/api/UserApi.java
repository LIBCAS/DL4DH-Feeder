package cz.inqool.dl4dh.feeder.api;

import cz.inqool.dl4dh.feeder.dto.CurrentUserDto;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.stream.Collectors;

/**
 * @author Peter Sekan
 */
@RestController
@RequestMapping("api/user")
public class UserApi {

    @PreAuthorize("isAuthenticated()")
    @GetMapping(path = "/me")
    public CurrentUserDto me(Principal principal, Authentication authentication) {
        return new CurrentUserDto(principal.getName(), authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
    }

    @GetMapping(path = "/logout")
    public void logout(HttpServletRequest request) throws ServletException {
        request.logout();
    }
}
