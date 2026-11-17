package com.travelplanner.dto.itinerary;

import java.math.BigDecimal;

public record ItineraryActivityDto(
    String id,
    String itineraryDayId,
    String timeSlot, // MORNING, AFTERNOON, EVENING, NIGHT
    String startTime,
    String endTime,
    String title,
    String description,
    String locationName,
    Double latitude,
    Double longitude,
    String activityType, // ATTRACTION, DINING, TRANSPORT, LEISURE
    BigDecimal estimatedCost,
    String currency,
    Integer durationMinutes,
    String transportModeToNext,
    Integer transportDurationToNextMinutes,
    Integer orderIndex,
    String bookingReference
) {}
