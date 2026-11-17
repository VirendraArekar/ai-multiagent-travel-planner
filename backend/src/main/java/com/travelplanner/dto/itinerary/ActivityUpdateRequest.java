package com.travelplanner.dto.itinerary;

import java.math.BigDecimal;

public record ActivityUpdateRequest(
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
    Integer durationMinutes,
    String transportModeToNext,
    Integer transportDurationToNextMinutes,
    Integer orderIndex
) {}
