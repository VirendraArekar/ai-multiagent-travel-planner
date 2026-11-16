package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.RestaurantTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class FoodRestaurantAgent extends BaseAgent {

    private final RestaurantTool restaurantTool;

    public FoodRestaurantAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            RestaurantTool restaurantTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.restaurantTool = restaurantTool;
    }

    @Override public String getAgentName() { return "Food & Restaurant Agent"; }
    @Override public String getAgentRole() { return "Culinary Specialist"; }
    @Override public int getExecutionOrder() { return 7; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destId = context.getTrip().getDestinationId();
        String destName = context.getTrip().getDestination();
        boolean vegPreferred = context.getWizardRequest() != null &&
                context.getWizardRequest().foodPreference() != null &&
                context.getWizardRequest().foodPreference().toLowerCase().contains("veg");

        logInfo(task, "Discovering culinary experiences and top dining venues in " + destName + " (Veg preferred: " + vegPreferred + ")");
        long tStart = System.currentTimeMillis();
        List<Map<String, Object>> restaurants = restaurantTool.getRestaurants(destId, vegPreferred);
        recordToolCall(task, "RestaurantTool.getRestaurants", "destId=" + destId + ", vegOnly=" + vegPreferred, "Found " + restaurants.size() + " restaurants", System.currentTimeMillis() - tStart, true);

        context.getFoodRecommendations().clear();
        context.getFoodRecommendations().addAll(restaurants);

        LlmResponse llmResp = llmClient.generateResponse(
                "You are a Michelin guide inspector and culinary traveler.",
                "Detail famous regional delicacies and dining etiquette for " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName + ", Vegetarian: " + vegPreferred);
        task.setOutputPayload("Selected " + restaurants.size() + " top-rated dining spots with iconic regional delicacies.");
    }
}
