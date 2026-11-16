package com.travelplanner.dto.trip;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record WizardTripRequest(
    String naturalLanguagePrompt,
    String startingLocation,
    String destination,
    LocalDate departureDate,
    LocalDate returnDate,
    Integer adults,
    Integer children,
    String travelType, // SOLO, COUPLE, FAMILY, FRIENDS, BUSINESS, HONEYMOON, ADVENTURE
    BigDecimal budgetRange,
    String currency,
    List<String> travelPreferences,
    String hotelPreference,
    String transportationPreference,
    String foodPreference,
    String adventurePreference,
    String relaxationPreference,
    String specialRequirements
) {}
