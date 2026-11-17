package com.travelplanner.dto.discovery;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FlightSearchCriteria(
    String originAirport,
    String destinationAirport,
    LocalDate departureDate,
    LocalDate returnDate,
    Integer passengers,
    String cabinClass,
    Boolean directOnly,
    BigDecimal maxPrice,
    String preferredAirline,
    String sortBy // PRICE_ASC, DURATION_ASC, DEPARTURE_TIME
) {}
