package backend.repository;

import backend.entity.LikeToComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeToCommentRepository extends JpaRepository<LikeToComment, Long> {
}
