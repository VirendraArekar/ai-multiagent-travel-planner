package com.travelplanner.dto.budget;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TripExpenseDto(
    String id,
    String tripId,
    String category, // FLIGHT, HOTEL, TRANSPORT, FOOD, ACTIVITY, SHOPPING, MISC
    String title,
    BigDecimal amount,
    String currency,
    LocalDate date,
    String paidBy,
    String notes,
    String receiptUrl
) {}
