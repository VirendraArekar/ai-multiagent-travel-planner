package com.travelplanner.dto.booking;

import java.math.BigDecimal;
import java.time.Instant;

public record BookingDto(
    String id,
    String tripId,
    String userId,
    String bookingType,
    String provider,
    String bookingReference,
    String status,
    String itemTitle,
    String startDatetime,
    String endDatetime,
    BigDecimal totalPrice,
    String currency,
    String cancellationPolicy,
    String providerLink,
    String notes,
    Instant createdAt
) {}
