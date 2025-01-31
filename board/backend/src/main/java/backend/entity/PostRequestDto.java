package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private String username;

    @QueryProjection
    public PostRequestDto(String title, String content, String username) {
        this.title = title;
        this.content = content;
        this.username = username;
    }
}
