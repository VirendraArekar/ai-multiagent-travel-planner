package com.travelplanner.dto.booking;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record BookingCreateRequest(
    String tripId,
    @NotBlank(message = "Booking type is required")
    String bookingType,
    @NotBlank(message = "Provider is required")
    String provider,
    String bookingReference,
    String status,
    @NotBlank(message = "Item title is required")
    String itemTitle,
    String startDatetime,
    String endDatetime,
    BigDecimal totalPrice,
    String currency,
    String cancellationPolicy,
    String providerLink,
    String notes
) {}
