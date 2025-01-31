package backend.repository;

import backend.entity.CommentResponseDto;
import backend.entity.QCommentResponseDto;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import static backend.entity.QComment.comment;

public class CommentRepositoryImpl implements CommentRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    public CommentRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public CommentResponseDto getCommentDto(Long id) {
        return queryFactory
                .select(new QCommentResponseDto(
                  comment.id.as("commentId"),
                  comment.content,
                  comment.createdDate,
                  comment.modifiedDate,
                  comment.siteUser.username,
                  comment.post.id
                ))
                .from(comment)
                .where(idEq(id))
                .fetchFirst();
    }

    private Predicate idEq(Long idCond) {
        if(idCond == null) return null;

        return comment.id.eq(idCond);
    }
}
