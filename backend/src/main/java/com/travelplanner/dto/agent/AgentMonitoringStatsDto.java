package com.travelplanner.dto.agent;

import java.math.BigDecimal;
import java.util.Map;

public record AgentMonitoringStatsDto(
    long totalAgents,
    long activeAgents,
    long totalTasksExecuted,
    long completedTasks,
    long failedTasks,
    long runningTasks,
    long totalTokensConsumed,
    BigDecimal totalEstimatedCostUsd,
    double averageExecutionDurationMs,
    Map<String, Long> tasksByAgent
) {}
