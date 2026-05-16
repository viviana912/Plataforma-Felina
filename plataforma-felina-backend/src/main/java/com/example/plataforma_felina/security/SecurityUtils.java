package com.example.plataforma_felina.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

public final class SecurityUtils {

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private SecurityUtils() {
    }

    public static AuthenticatedUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof AuthenticatedUser user)) {
            return null;
        }
        return user;
    }

    public static Long currentUserId() {
        AuthenticatedUser user = currentUser();
        return user == null ? null : user.id();
    }

    public static boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if (ROLE_ADMIN.equals(a.getAuthority())) return true;
        }
        return false;
    }

    public static boolean canAccessUser(Long requestedUserId) {
        if (requestedUserId == null) return false;
        if (isAdmin()) return true;
        Long current = currentUserId();
        return current != null && current.equals(requestedUserId);
    }

    public static void requireAccessToUser(Long requestedUserId) {
        if (!canAccessUser(requestedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso no autorizado a recursos de otro usuario");
        }
    }
}
