package backend.service;

import backend.entity.*;
import backend.repository.PostRepository;
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

    @Transactional
    public void createPost(PostRequestDto postRequestDto, SiteUser siteUser) {
        Post post = new Post();
        post.setTitle(postRequestDto.getTitle());
        post.setContent(postRequestDto.getContent());
        post.setSiteUser(siteUser);
        post.setCreatedDate(LocalDateTime.now());
        postRepository.save(post);
    }

    public Post getPostEntity(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public PostResponseDto getPostDto(Long id) {
        return postRepository.getPostDto(id);
    }

    public Page<PostPageResponseDto> getPostDtoList(Pageable pageable) {
        return postRepository.getPostDtoList(pageable);
    }

    @Transactional
    public void modifyPost(PostRequestDto postRequestDto, Long id) {
        Post post = getPostEntity(id);
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
