package backend.controller;

import backend.entity.*;
import backend.service.CommentService;
import backend.service.PostService;
import backend.service.SiteUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/comment")
@RestController
@RequiredArgsConstructor
public class CommentApiController {
    private final CommentService commentService;
    private final PostService postService;
    private final SiteUserService siteUserService;

    @PostMapping("/create/{id}")
    public CommentRequestDto createComment(@PathVariable Long id, @RequestBody CommentRequestDto commentRequestDto) {
        Post post = postService.getPostEntity(id);
        SiteUser siteUser = siteUserService.getSiteUserEntityByUsername(commentRequestDto.getUsername());
        commentService.createComment(post, siteUser, commentRequestDto);
        return commentRequestDto;
    }

    @GetMapping("/detail/{id}")
    public CommentResponseDto getCommentDto(@PathVariable Long id) {
        return this.commentService.getCommentDto(id);
    }

    @PatchMapping("/modify/{id}")
    public CommentRequestDto modifyComment(@RequestBody CommentRequestDto commentRequestDto, @PathVariable Long id) {
        commentService.modifyComment(commentRequestDto, id);
        return commentRequestDto;
    }

    @DeleteMapping("/delete/{id}")
    public CommentResponseDto deleteComment(@PathVariable Long id) {
        CommentResponseDto commentResponseDto = getCommentDto(id);
        commentService.deleteComment(id);
        return commentResponseDto;
    }
}
