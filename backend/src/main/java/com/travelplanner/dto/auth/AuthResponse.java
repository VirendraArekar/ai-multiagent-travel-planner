package com.travelplanner.dto.auth;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    String userId,
    String email,
    String firstName,
    String lastName,
    String role
) {
    public static AuthResponse of(String accessToken, String refreshToken, String userId, String email, String firstName, String lastName, String role) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", userId, email, firstName, lastName, role);
    }
}
