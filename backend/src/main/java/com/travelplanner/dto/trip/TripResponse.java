package com.travelplanner.dto.trip;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record TripResponse(
    String id,
    String userId,
    String title,
    String origin,
    String destination,
    String destinationId,
    LocalDate startDate,
    LocalDate endDate,
    Integer totalDays,
    Integer adultsCount,
    Integer childrenCount,
    String travelType,
    BigDecimal budgetLimit,
    String currency,
    String pace,
    String status,
    String notes,
    String heroImageUrl,
    boolean isPublic,
    String shareToken,
    Instant createdAt,
    Instant updatedAt
) {}
