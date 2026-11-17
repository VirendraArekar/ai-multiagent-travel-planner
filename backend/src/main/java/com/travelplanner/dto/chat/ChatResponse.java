package com.travelplanner.dto.chat;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ChatResponse(
    String conversationId,
    String messageId,
    String sender,
    String agentName,
    String reply,
    Map<String, Object> extractedTripIntent,
    List<String> suggestedFollowUps,
    Instant timestamp
) {}
