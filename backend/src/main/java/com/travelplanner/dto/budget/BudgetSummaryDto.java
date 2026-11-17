package com.travelplanner.dto.budget;

import java.math.BigDecimal;
import java.util.Map;

public record BudgetSummaryDto(
    BigDecimal totalBudget,
    BigDecimal totalActualSpent,
    BigDecimal remainingBudget,
    BigDecimal perPersonBudget,
    BigDecimal perPersonActualSpent,
    String currency,
    Map<String, BigDecimal> allocatedByCategory,
    Map<String, BigDecimal> actualByCategory,
    boolean isOverBudget,
    BigDecimal percentageUsed
) {}
