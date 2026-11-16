package com.travelplanner.dto.trip;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TripUpdateRequest(
    String title,
    String destination,
    LocalDate startDate,
    LocalDate endDate,
    Integer adultsCount,
    Integer childrenCount,
    String travelType,
    BigDecimal budgetLimit,
    String currency,
    String pace,
    String status,
    String notes,
    Boolean isPublic
) {}
