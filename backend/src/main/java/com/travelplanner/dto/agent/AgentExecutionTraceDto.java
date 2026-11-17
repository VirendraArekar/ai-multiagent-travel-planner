package com.travelplanner.dto.agent;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record AgentExecutionTraceDto(
    String tripId,
    String overallStatus, // PENDING, RUNNING, COMPLETED, FAILED
    Integer totalTasks,
    Integer completedTasks,
    Integer failedTasks,
    Long totalDurationMs,
    Integer totalTokensUsed,
    BigDecimal totalEstimatedCostUsd,
    List<AgentTaskDto> tasks,
    Instant startedAt,
    Instant finishedAt
) {}
