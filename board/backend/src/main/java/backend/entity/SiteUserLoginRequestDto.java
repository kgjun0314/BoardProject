package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class SiteUserLoginRequestDto {
    private String username;
    private String password;

    @QueryProjection
    public SiteUserLoginRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
