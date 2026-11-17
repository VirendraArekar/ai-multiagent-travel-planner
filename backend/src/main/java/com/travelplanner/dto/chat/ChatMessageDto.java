package com.travelplanner.dto.chat;

import java.time.Instant;

public record ChatMessageDto(
    String id,
    String conversationId,
    String sender,
    String content,
    String agentName,
    String metadata,
    Integer tokensUsed,
    Instant createdAt
) {}
