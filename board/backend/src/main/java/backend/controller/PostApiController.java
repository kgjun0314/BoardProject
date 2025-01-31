package backend.controller;

import backend.entity.PostPageResponseDto;
import backend.entity.PostRequestDto;
import backend.entity.PostResponseDto;
import backend.entity.SiteUser;
import backend.service.PostService;
import backend.service.SiteUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/post")
@RestController
@RequiredArgsConstructor
public class PostApiController {
    private final PostService postService;
    private final SiteUserService siteUserService;

    @PostMapping("/create")
    public PostRequestDto createPost(@RequestBody PostRequestDto postRequestDto) {
        SiteUser siteUser = siteUserService.getSiteUserEntityByUsername(postRequestDto.getUsername());
        postService.createPost(postRequestDto, siteUser);
        return postRequestDto;
    }

    @GetMapping("/detail/{id}")
    public PostResponseDto getPostDto(@PathVariable Long id) {
        return this.postService.getPostDto(id);
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getPostDtoList(@RequestParam(value = "page", defaultValue = "0") int page) {
        PageRequest pageRequest = PageRequest.of(page, 10);
        Page<PostPageResponseDto> postPage = postService.getPostDtoList(pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("content", postPage.getContent());
        response.put("totalPages", postPage.getTotalPages());
        response.put("totalElements", postPage.getTotalElements());
        response.put("number", postPage.getNumber());
        response.put("size", postPage.getSize());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/modify/{id}")
    public PostRequestDto modifyPost(@RequestBody PostRequestDto postRequestDto, @PathVariable Long id) {
        postService.modifyPost(postRequestDto, id);
        return postRequestDto;
    }

    @DeleteMapping("/delete/{id}")
    public PostResponseDto deletePost(@PathVariable Long id) {
        PostResponseDto postResponseDto = getPostDto(id);
        postService.deletePost(id);
        return postResponseDto;
    }
}
