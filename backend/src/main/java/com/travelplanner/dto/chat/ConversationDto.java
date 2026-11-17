package com.travelplanner.dto.chat;

import java.time.Instant;
import java.util.List;

public record ConversationDto(
    String id,
    String userId,
    String tripId,
    String title,
    Instant createdAt,
    Instant updatedAt,
    List<ChatMessageDto> messages
) {}
