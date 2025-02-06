package backend.service;

import backend.entity.*;
import backend.repository.LikeToPostRepository;
import backend.repository.PostRepository;
import backend.repository.SiteUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final LikeToPostRepository likeToPostRepository;

    @Transactional
    public void createPost(PostRequestDto postRequestDto, SiteUser siteUser) {
        Post post = new Post();
        post.setTitle(postRequestDto.getTitle());
        post.setContent(postRequestDto.getContent());
        post.setSiteUser(siteUser);
        post.setCreatedDate(LocalDateTime.now());
        postRepository.save(post);
    }

    @Transactional
    public void likePost(Post post, SiteUser siteUser) {
        LikeToPost likeToPost = new LikeToPost();
        likeToPost.setPost(post);
        likeToPost.setSiteUser(siteUser);
        likeToPostRepository.save(likeToPost);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public PostResponseDto getPostDto(Long id) {
        return postRepository.getPostDto(id);
    }

    public Page<PostPageResponseDto> getPostDtoList(Pageable pageable, String query) {
        return postRepository.getPostDtoList(pageable, query);
    }

    @Transactional
    public void modifyPost(PostRequestDto postRequestDto, Long id) {
        Post post = getPost(id);
        post.setTitle(postRequestDto.getTitle());
        post.setContent(postRequestDto.getContent());
        post.setModifiedDate(LocalDateTime.now());
        postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
