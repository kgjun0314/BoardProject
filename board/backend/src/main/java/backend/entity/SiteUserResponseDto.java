package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class SiteUserResponseDto {
    private Long siteuserId;
    private String username;
    private String email;

    public SiteUserResponseDto() {

    }

    @QueryProjection
    public SiteUserResponseDto(Long siteuserId, String username, String email) {
        this.siteuserId = siteuserId;
        this.username = username;
        this.email = email;
    }
}
