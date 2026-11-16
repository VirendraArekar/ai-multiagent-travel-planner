package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class TransportationAgent extends BaseAgent {

    public TransportationAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
    }

    @Override public String getAgentName() { return "Transportation Agent"; }
    @Override public String getAgentRole() { return "Transit & Route Specialist"; }
    @Override public int getExecutionOrder() { return 8; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destName = context.getTrip().getDestination();

        logInfo(task, "Formulating airport transfer, local metro transit passes, and walking cluster routes for " + destName);

        context.getTransitRecommendations().clear();
        context.getTransitRecommendations().addAll(List.of(
                Map.of(
                        "type", "AIRPORT_EXPRESS",
                        "name", "Airport Express Train / Direct Shuttle",
                        "durationMinutes", 35,
                        "estimatedCostUsd", BigDecimal.valueOf(14.00),
                        "recommendation", "Fastest and most economical transit from airport directly to city center terminal"
                ),
                Map.of(
                        "type", "METRO_PASS",
                        "name", "Multi-Day Unlimited Public Transit Card",
                        "durationMinutes", 0,
                        "estimatedCostUsd", BigDecimal.valueOf(25.00),
                        "recommendation", "Covers all subway lines, trams, and urban bus routes with seamless contactless taps"
                ),
                Map.of(
                        "type", "WALKING",
                        "name", "Scenic Historical District Walkway",
                        "durationMinutes", 20,
                        "estimatedCostUsd", BigDecimal.ZERO,
                        "recommendation", "Optimal way to experience city architecture and hidden side-street cafes"
                )
        ));

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an urban transit routing specialist.",
                "Detail most efficient transit passes and navigation tips for " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName);
        task.setOutputPayload("Formulated transit blueprint: Airport Express + Multi-day Unlimited Pass + Geographic pedestrian routes.");
    }
}
