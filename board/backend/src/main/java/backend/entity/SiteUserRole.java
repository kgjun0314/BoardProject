package backend.entity;

import lombok.Getter;

@Getter
public enum SiteUserRole {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");

    private String value;

    SiteUserRole(String value) {
        this.value = value;
    }
}
