package com.travelplanner.dto.trip;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TripSummaryDto(
    String id,
    String title,
    String origin,
    String destination,
    LocalDate startDate,
    LocalDate endDate,
    Integer totalDays,
    String travelType,
    String status,
    String heroImageUrl,
    BigDecimal budgetLimit,
    String currency,
    BigDecimal totalEstimatedCost,
    Integer totalActivitiesCount,
    String shareToken
) {}
