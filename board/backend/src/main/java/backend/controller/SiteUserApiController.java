package backend.controller;

import backend.JwtUtil;
import backend.entity.SiteUser;
import backend.entity.SiteUserRequestDto;
import backend.entity.SiteUserResponseDto;
import backend.entity.TokenResponseDto;
import backend.service.SiteUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/siteuser")
@RestController
@RequiredArgsConstructor
public class SiteUserApiController {
    private final SiteUserService siteUserService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SiteUserRequestDto siteUserRequestDto) {
        SiteUser siteUser = siteUserService.getSiteUserEntityByUsername(siteUserRequestDto.getUsername());

        if(!passwordEncoder.matches(siteUserRequestDto.getPassword(), siteUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String token = JwtUtil.generateToken(siteUser.getUsername());
        return ResponseEntity.ok(new TokenResponseDto(token));
    }

    // /me 엔드포인트 추가
    @GetMapping("/me")
    public ResponseEntity<?> getSiteUserInfo(@RequestHeader("Authorization") String token) {
        String username = JwtUtil.validateToken(token.replace("Bearer ", ""));

        if (username == null) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        SiteUserResponseDto siteUserResponseDto = siteUserService.getSiteUserDtoByUsername(username);

        return ResponseEntity.ok(siteUserResponseDto);
    }

    @PostMapping("/signup")
    public SiteUserRequestDto signup(@RequestBody SiteUserRequestDto siteUserRequestDto) {
        siteUserService.createSiteUser(siteUserRequestDto);
        return siteUserRequestDto;
    }
}
