package com.travelplanner.dto.itinerary;

import java.time.LocalDate;
import java.util.List;

public record ItineraryDayDto(
    String id,
    String itineraryId,
    Integer dayNumber,
    LocalDate date,
    String theme,
    String weatherSummary,
    String notes,
    List<ItineraryActivityDto> activities
) {}
