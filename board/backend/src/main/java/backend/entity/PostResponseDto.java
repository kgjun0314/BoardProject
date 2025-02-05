package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponseDto {
    private Long postId;
    private String title;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private List<CommentResponseDto> commentList;
    private String siteUserName;
    private Integer likeCount;

    public PostResponseDto() {

    }

    @QueryProjection
    public PostResponseDto(Long postId, String title, String content, LocalDateTime createdDate, LocalDateTime modifiedDate, List<CommentResponseDto> commentList, String siteUserName, Integer likeCount) {
        this.postId = postId;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.commentList = commentList;
        this.siteUserName = siteUserName;
        this.likeCount = likeCount;
    }
}
