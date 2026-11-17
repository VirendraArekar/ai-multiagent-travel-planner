package com.travelplanner.dto.itinerary;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ActivityCreateRequest(
    @NotBlank(message = "Title is required")
    String title,
    String timeSlot,
    String startTime,
    String endTime,
    String description,
    String locationName,
    Double latitude,
    Double longitude,
    String activityType,
    BigDecimal estimatedCost,
    String currency,
    Integer durationMinutes,
    String transportModeToNext,
    Integer transportDurationToNextMinutes,
    Integer orderIndex
) {}
