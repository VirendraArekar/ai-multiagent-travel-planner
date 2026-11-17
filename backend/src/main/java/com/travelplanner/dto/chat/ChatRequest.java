package com.travelplanner.dto.chat;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
    String conversationId,
    String tripId,
    @NotBlank(message = "Message content is required")
    String message
) {}
