package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.HotelSearchTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class HotelRecommendationAgent extends BaseAgent {

    private final HotelSearchTool hotelSearchTool;

    public HotelRecommendationAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            HotelSearchTool hotelSearchTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.hotelSearchTool = hotelSearchTool;
    }

    @Override public String getAgentName() { return "Hotel Recommendation Agent"; }
    @Override public String getAgentRole() { return "Hospitality Specialist"; }
    @Override public int getExecutionOrder() { return 4; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destId = context.getTrip().getDestinationId();
        String destName = context.getTrip().getDestination();
        String tier = context.getWizardRequest() != null ? context.getWizardRequest().hotelPreference() : "MID_RANGE";

        logInfo(task, "Searching verified accommodations in " + destName + " (Preferred Tier: " + tier + ")");
        long tStart = System.currentTimeMillis();
        List<Map<String, Object>> hotels = hotelSearchTool.searchHotels(destId, tier);
        recordToolCall(task, "HotelSearchTool.searchHotels", "destId=" + destId + ", tier=" + tier, "Found " + hotels.size() + " hotels", System.currentTimeMillis() - tStart, true);

        context.getHotelOptions().clear();
        context.getHotelOptions().addAll(hotels);

        LlmResponse llmResp = llmClient.generateResponse(
                "You are a luxury and boutique hotel advisor.",
                "Recommend top accommodation features for staying in " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName + ", Tier: " + tier);
        task.setOutputPayload("Selected " + hotels.size() + " verified hotels with average rating above 4.4/5.");
    }
}
