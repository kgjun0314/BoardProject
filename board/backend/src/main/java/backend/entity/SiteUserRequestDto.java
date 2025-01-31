package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class SiteUserRequestDto {
    private String username;
    private String password;
    private String email;

    @QueryProjection
    public SiteUserRequestDto(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
