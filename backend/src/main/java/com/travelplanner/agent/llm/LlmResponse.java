package com.travelplanner.agent.llm;

import java.math.BigDecimal;

public record LlmResponse(
    String content,
    int promptTokens,
    int completionTokens,
    int totalTokens,
    BigDecimal estimatedCostUsd
) {
    public static LlmResponse of(String content, int promptTokens, int completionTokens) {
        int total = promptTokens + completionTokens;
        // Gemini 2.5 Flash pricing approximately $0.075 per 1M tokens
        BigDecimal cost = BigDecimal.valueOf(total)
                .multiply(BigDecimal.valueOf(0.000000075));
        return new LlmResponse(content, promptTokens, completionTokens, total, cost);
    }
}
