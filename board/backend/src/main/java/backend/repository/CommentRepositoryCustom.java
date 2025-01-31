package backend.repository;

import backend.entity.CommentResponseDto;

public interface CommentRepositoryCustom {
    CommentResponseDto getCommentDto(Long id);
}
