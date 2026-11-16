package com.travelplanner.agent.tools;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Component
public class CurrencyConverterTool {

    // Exchange rates normalized against 1 USD
    private static final Map<String, BigDecimal> RATES = Map.of(
            "USD", BigDecimal.ONE,
            "EUR", BigDecimal.valueOf(0.92),
            "GBP", BigDecimal.valueOf(0.79),
            "INR", BigDecimal.valueOf(86.50),
            "JPY", BigDecimal.valueOf(152.00),
            "AED", BigDecimal.valueOf(3.67),
            "AUD", BigDecimal.valueOf(1.54),
            "CAD", BigDecimal.valueOf(1.39),
            "CHF", BigDecimal.valueOf(0.88),
            "SGD", BigDecimal.valueOf(1.34)
    );

    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (amount == null) return BigDecimal.ZERO;
        if (fromCurrency == null || toCurrency == null || fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount;
        }

        BigDecimal fromRate = RATES.getOrDefault(fromCurrency.toUpperCase(), BigDecimal.ONE);
        BigDecimal toRate = RATES.getOrDefault(toCurrency.toUpperCase(), BigDecimal.ONE);

        // amount in USD = amount / fromRate
        BigDecimal inUsd = amount.divide(fromRate, 6, RoundingMode.HALF_UP);
        // converted = inUsd * toRate
        return inUsd.multiply(toRate).setScale(2, RoundingMode.HALF_UP);
    }
}
