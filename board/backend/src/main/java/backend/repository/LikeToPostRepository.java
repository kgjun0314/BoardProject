package backend.repository;

import backend.entity.LikeToPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeToPostRepository extends JpaRepository<LikeToPost, Long> {
}
