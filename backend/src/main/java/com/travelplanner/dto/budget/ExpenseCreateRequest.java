package com.travelplanner.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseCreateRequest(
    @NotBlank(message = "Category is required")
    String category,

    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    BigDecimal amount,

    String currency,
    LocalDate date,
    String paidBy,
    String notes,
    String receiptUrl
) {}
