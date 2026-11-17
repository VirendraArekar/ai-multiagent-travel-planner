package com.travelplanner.service;

import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.domain.model.ChatMessage;
import com.travelplanner.domain.model.Conversation;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.ChatMessageRepository;
import com.travelplanner.domain.repository.ConversationRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.chat.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final LlmClient llmClient;

    public ChatService(
            ConversationRepository conversationRepository,
            ChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            TripRepository tripRepository,
            LlmClient llmClient) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.llmClient = llmClient;
    }

    @Transactional
    public ChatResponse sendMessage(String userId, ChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Conversation conv;
        if (StringUtils.hasText(request.conversationId())) {
            conv = conversationRepository.findById(request.conversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        } else {
            conv = new Conversation();
            conv.setUser(user);
            conv.setTripId(request.tripId());
            conv.setTitle("Trip Planning with AI Assistant");
            conv = conversationRepository.save(conv);
        }

        // Save User Message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setConversation(conv);
        userMsg.setSender("USER");
        userMsg.setContent(request.message());
        chatMessageRepository.save(userMsg);

        // Build Context from Trip if present
        StringBuilder contextBuilder = new StringBuilder();
        if (conv.getTripId() != null) {
            tripRepository.findById(conv.getTripId()).ifPresent(t -> {
                contextBuilder.append("Active Trip Context:\n")
                        .append("Destination: ").append(t.getDestination()).append("\n")
                        .append("Dates: ").append(t.getStartDate()).append(" to ").append(t.getEndDate()).append("\n")
                        .append("Travelers: ").append(t.getAdultsCount()).append(" Adults, ").append(t.getChildrenCount()).append(" Children\n")
                        .append("Budget: ").append(t.getCurrency()).append(" ").append(t.getBudgetLimit()).append("\n");
            });
        }

        // Generate response via LLM
        String systemPrompt = "You are a world-class AI travel planner and concierge assistant. " +
                "You assist users in discovering destinations, refining day-by-day itineraries, explaining weather patterns, recommending dining, and optimizing budgets. " +
                "Be warm, concise, and practically actionable.\n" + contextBuilder;

        LlmResponse llmResp = llmClient.generateResponse(systemPrompt, request.message());

        // Extract potential trip intent
        Map<String, Object> extractedIntent = extractIntent(request.message());

        // Save Assistant Message
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setConversation(conv);
        assistantMsg.setSender("ASSISTANT");
        assistantMsg.setAgentName("Orchestrator Concierge");
        assistantMsg.setContent(llmResp.content());
        assistantMsg.setTokensUsed(llmResp.totalTokens());
        chatMessageRepository.save(assistantMsg);

        conv.setUpdatedAt(Instant.now());
        conversationRepository.save(conv);

        List<String> followUps = List.of(
                "Can you suggest top vegetarian dining options nearby?",
                "What is the best way to get from the airport to the city center?",
                "Are there any rain-friendly indoor attractions to include?",
                "How can we optimize the daily budget to save 15%?"
        );

        return new ChatResponse(
                conv.getId(),
                assistantMsg.getId(),
                "ASSISTANT",
                "Orchestrator Concierge",
                llmResp.content(),
                extractedIntent,
                followUps,
                assistantMsg.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public ConversationDto getConversation(String conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        List<ChatMessageDto> msgDtos = conv.getMessages().stream()
                .map(m -> new ChatMessageDto(
                        m.getId(),
                        conv.getId(),
                        m.getSender(),
                        m.getContent(),
                        m.getAgentName(),
                        m.getMetadata(),
                        m.getTokensUsed(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new ConversationDto(
                conv.getId(),
                conv.getUser().getId(),
                conv.getTripId(),
                conv.getTitle(),
                conv.getCreatedAt(),
                conv.getUpdatedAt(),
                msgDtos
        );
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(String userId) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(conv -> new ConversationDto(
                        conv.getId(),
                        conv.getUser().getId(),
                        conv.getTripId(),
                        conv.getTitle(),
                        conv.getCreatedAt(),
                        conv.getUpdatedAt(),
                        List.of()
                ))
                .collect(Collectors.toList());
    }

    private Map<String, Object> extractIntent(String text) {
        Map<String, Object> intent = new HashMap<>();
        Pattern toPattern = Pattern.compile("(?i)(?:to|visit|in)\\s+([A-Za-z\\s]+?)(?:\\s+for|\\s+with|\\s+next|\\.|$)");
        Matcher toMatcher = toPattern.matcher(text);
        if (toMatcher.find()) {
            intent.put("destination", toMatcher.group(1).trim());
        }

        Pattern daysPattern = Pattern.compile("(?i)(\\d+)\\s*(?:days|day)");
        Matcher daysMatcher = daysPattern.matcher(text);
        if (daysMatcher.find()) {
            intent.put("totalDays", Integer.parseInt(daysMatcher.group(1)));
        }

        Pattern budgetPattern = Pattern.compile("(?i)(?:budget|around|under)\\s*(?:₹|\\$|€|INR|USD)?\\s*([0-9,]+)");
        Matcher budgetMatcher = budgetPattern.matcher(text);
        if (budgetMatcher.find()) {
            intent.put("budget", budgetMatcher.group(1).replace(",", ""));
        }

        return intent;
    }
}
