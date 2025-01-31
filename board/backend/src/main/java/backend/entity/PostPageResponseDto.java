package backend.entity;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostPageResponseDto {
    private Long postId;
    private String title;
    private LocalDateTime createdDate;
    private Integer commentListSize;
    private String siteUserName;

    public PostPageResponseDto() {

    }

    @QueryProjection
    public PostPageResponseDto(Long postId, String title, LocalDateTime createdDate, Integer commentListSize, String siteUserName) {
        this.postId = postId;
        this.title = title;
        this.createdDate = createdDate;
        this.commentListSize = commentListSize;
        this.siteUserName = siteUserName;
    }
}
