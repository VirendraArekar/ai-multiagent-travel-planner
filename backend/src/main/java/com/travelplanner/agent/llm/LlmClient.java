package com.travelplanner.agent.llm;

public interface LlmClient {
    LlmResponse generateResponse(String systemPrompt, String userPrompt);
    String getProviderName();
    boolean isAvailable();
}
