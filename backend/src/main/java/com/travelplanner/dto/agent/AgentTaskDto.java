package com.travelplanner.dto.agent;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record AgentTaskDto(
    String id,
    String tripId,
    String agentId,
    String agentName,
    String taskName,
    String status, // PENDING, RUNNING, COMPLETED, FAILED, RETRYING, WAITING_FOR_USER
    String inputPayload,
    String outputPayload,
    String errorMessage,
    Integer retryCount,
    Integer executionOrder,
    Long durationMs,
    Integer tokensUsed,
    BigDecimal costUsd,
    List<AgentExecutionLogDto> logs,
    List<AgentToolCallDto> toolCalls,
    Instant createdAt,
    Instant updatedAt
) {
    public record AgentExecutionLogDto(
        String id,
        String logLevel,
        String message,
        Instant timestamp
    ) {}

    public record AgentToolCallDto(
        String id,
        String toolName,
        String arguments,
        String result,
        Long durationMs,
        String status,
        Instant createdAt
    ) {}
}
