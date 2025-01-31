package backend.repository;

import backend.entity.*;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

import static backend.entity.QComment.comment;
import static backend.entity.QPost.post;

public class PostRepositoryImpl implements PostRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    public PostRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public PostResponseDto getPostDto(Long id) {
        List<CommentResponseDto> comments = queryFactory
                .select(new QCommentResponseDto(
                        comment.id.as("commentId"),
                        comment.content,
                        comment.createdDate,
                        comment.modifiedDate,
                        comment.siteUser.username,
                        Expressions.constant(id)
                ))
                .from(comment)
                .where(comment.post.id.eq(id))
                .fetch();

        return queryFactory
                .select(new QPostResponseDto(
                        post.id.as("postId"),
                        post.title,
                        post.content,
                        post.createdDate,
                        post.modifiedDate,
                        Expressions.constant(comments),
                        post.siteUser.username
                ))
                .from(post)
                .where(idEq(id))
                .fetchFirst();
    }

    private Predicate idEq(Long idCond) {
        if(idCond == null) return null;

        return post.id.eq(idCond);
    }

    @Override
    public Page<PostPageResponseDto> getPostDtoList(Pageable pageable){
        QueryResults<PostPageResponseDto> queryResults = queryFactory
                .select(new QPostPageResponseDto(
                        post.id.as("postId"),
                        post.title,
                        post.createdDate,
                        post.commentList.size(),
                        post.siteUser.username
                ))
                .from(post)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(post.createdDate.desc())
                .fetchResults();

        List<PostPageResponseDto> posts  = queryResults.getResults();

        return new PageImpl<>(posts, pageable, queryResults.getTotal());
    }
}
