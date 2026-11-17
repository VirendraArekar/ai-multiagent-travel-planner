package com.travelplanner.dto.budget;

import java.math.BigDecimal;

public record TripBudgetDto(
    String id,
    String tripId,
    BigDecimal totalBudget,
    BigDecimal flightsAllocated,
    BigDecimal hotelsAllocated,
    BigDecimal transportAllocated,
    BigDecimal foodAllocated,
    BigDecimal activitiesAllocated,
    BigDecimal emergencyAllocated,
    String currency
) {}
