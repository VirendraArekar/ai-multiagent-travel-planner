package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.dto.chat.ChatRequest;
import com.travelplanner.dto.chat.ChatResponse;
import com.travelplanner.dto.chat.ConversationDto;
import com.travelplanner.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.sendMessage(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getUserConversations(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ConversationDto> list = chatService.getUserConversations(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationDto>> getConversation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String conversationId) {
        ConversationDto conv = chatService.getConversation(conversationId);
        return ResponseEntity.ok(ApiResponse.ok(conv));
    }
}
