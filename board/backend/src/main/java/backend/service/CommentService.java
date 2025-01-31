package backend.service;

import backend.entity.*;
import backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional
    public void createComment(Post post, SiteUser siteUser, CommentRequestDto commentRequestDto) {
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setSiteUser(siteUser);
        comment.setContent(commentRequestDto.getContent());
        comment.setCreatedDate(LocalDateTime.now());
        commentRepository.save(comment);
    }

    public Comment getComment(Long id) {
        return commentRepository.findById(id).orElse(null);
    }

    public CommentResponseDto getCommentDto(Long id) {
        return this.commentRepository.getCommentDto(id);
    }

    @Transactional
    public void modifyComment(CommentRequestDto commentRequestDto, Long id) {
        Comment comment = getComment(id);
        comment.setContent(commentRequestDto.getContent());
        comment.setModifiedDate(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
