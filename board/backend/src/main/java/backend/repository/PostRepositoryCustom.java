package backend.repository;

import backend.entity.PostPageResponseDto;
import backend.entity.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostRepositoryCustom {
    PostResponseDto getPostDto(Long id);
    Page<PostPageResponseDto> getPostDtoList(Pageable pageable);
}
