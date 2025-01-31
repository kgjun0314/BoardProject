package backend.repository;

import backend.entity.SiteUserResponseDto;
import backend.entity.QSiteUserResponseDto;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import static backend.entity.QSiteUser.siteUser;

public class SiteUserRepositoryImpl implements SiteUserRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public SiteUserRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public SiteUserResponseDto getSiteUserDtoByUsername(String username) {
        return queryFactory
                .select(new QSiteUserResponseDto(
                        siteUser.id.as("siteuserId"),
                        siteUser.username,
                        siteUser.email
                ))
                .from(siteUser)
                .where(siteUser.username.eq(username))
                .fetchFirst();
    }
}
