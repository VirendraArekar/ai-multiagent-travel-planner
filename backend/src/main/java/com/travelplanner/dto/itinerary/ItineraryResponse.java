package com.travelplanner.dto.itinerary;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ItineraryResponse(
    String id,
    String tripId,
    Integer version,
    String summary,
    BigDecimal criticScore,
    String criticFeedback,
    boolean isOptimized,
    List<ItineraryDayDto> days,
    Instant createdAt,
    Instant updatedAt
) {}
