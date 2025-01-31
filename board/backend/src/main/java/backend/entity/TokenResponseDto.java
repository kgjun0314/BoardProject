package backend.entity;

import lombok.Getter;

@Getter
public class TokenResponseDto {
    private final String token;
    public TokenResponseDto(String token) {
        this.token = token;
    }
}
