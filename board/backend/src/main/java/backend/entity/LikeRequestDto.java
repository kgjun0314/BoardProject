package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class LikeRequestDto {
    private String username;

    @QueryProjection
    public LikeRequestDto(String username) {
        this.username = username;
    }
}
