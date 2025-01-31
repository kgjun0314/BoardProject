package backend.repository;

import backend.entity.SiteUserResponseDto;

public interface SiteUserRepositoryCustom {
    SiteUserResponseDto getSiteUserDtoByUsername(String username);
}
