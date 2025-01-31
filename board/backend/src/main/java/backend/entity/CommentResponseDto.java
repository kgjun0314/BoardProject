package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String siteUserName;
    private Long postId;

    public CommentResponseDto() {

    }

    @QueryProjection
    public CommentResponseDto(Long commentId, String content, LocalDateTime createdDate, LocalDateTime modifiedDate, String siteUserName, Long postId) {
        this.commentId = commentId;
        this.content = content;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.siteUserName = siteUserName;
        this.postId = postId;
    }
}
