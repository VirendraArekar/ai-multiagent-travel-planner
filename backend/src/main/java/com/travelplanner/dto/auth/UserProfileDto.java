package com.travelplanner.dto.auth;

import java.time.LocalDate;

public record UserProfileDto(
    String id,
    String email,
    String firstName,
    String lastName,
    String phoneNumber,
    String role,
    String avatarUrl,
    String bio,
    LocalDate dateOfBirth,
    String nationality,
    String preferredLanguage,
    String homeAirport,
    String dietaryPreferences,
    String preferredCurrency,
    String travelPace,
    String accommodationStyle,
    String interests,
    boolean emailNotificationsEnabled,
    boolean smsNotificationsEnabled
) {}
