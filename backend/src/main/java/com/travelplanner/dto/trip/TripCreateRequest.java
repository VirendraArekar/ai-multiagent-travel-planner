package com.travelplanner.dto.trip;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TripCreateRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "Origin is required")
    String origin,

    @NotBlank(message = "Destination is required")
    String destination,

    String destinationId,

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    LocalDate startDate,

    @NotNull(message = "End date is required")
    LocalDate endDate,

    @Min(value = 1, message = "At least 1 adult required")
    Integer adultsCount,

    Integer childrenCount,

    String travelType, // SOLO, COUPLE, FAMILY, FRIENDS, BUSINESS, HONEYMOON, ADVENTURE
    BigDecimal budgetLimit,
    String currency,
    String pace, // RELAXED, MODERATE, FAST_PACED
    String hotelPreference,
    String flightPreference,
    String foodPreference,
    String notes,
    List<String> interests
) {}
