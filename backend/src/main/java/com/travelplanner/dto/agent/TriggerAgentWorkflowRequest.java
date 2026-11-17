package com.travelplanner.dto.agent;

import jakarta.validation.constraints.NotBlank;

public record TriggerAgentWorkflowRequest(
    @NotBlank(message = "Trip ID is required")
    String tripId,
    String specificAgent, // Optional: if null, runs full multi-agent orchestration
    boolean forceRegenerate
) {}
