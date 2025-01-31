package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class CommentRequestDto {
    private String content;
    private String username;

    @QueryProjection
    public CommentRequestDto(String content, String username) {
        this.content = content;
        this.username = username;
    }
}
