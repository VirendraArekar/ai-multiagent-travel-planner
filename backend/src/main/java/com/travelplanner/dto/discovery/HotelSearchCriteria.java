package com.travelplanner.dto.discovery;

import java.math.BigDecimal;
import java.time.LocalDate;

public record HotelSearchCriteria(
    String destinationId,
    String destinationName,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    Integer guests,
    Integer rooms,
    String tier, // BUDGET, MID_RANGE, LUXURY
    Integer minStars,
    BigDecimal maxPricePerNight,
    Boolean familyFriendly,
    String sortBy // RATING_DESC, PRICE_ASC, PRICE_DESC
) {}
