package com.travelplanner.dto.agent;

import java.time.Instant;

public record AgentDto(
    String id,
    String name,
    String role,
    String description,
    String modelProvider,
    String modelName,
    boolean isActive,
    Instant updatedAt
) {}
