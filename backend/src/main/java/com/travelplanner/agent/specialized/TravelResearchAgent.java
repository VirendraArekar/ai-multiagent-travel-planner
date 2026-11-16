package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.AttractionTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class TravelResearchAgent extends BaseAgent {

    private final AttractionTool attractionTool;

    public TravelResearchAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            AttractionTool attractionTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.attractionTool = attractionTool;
    }

    @Override public String getAgentName() { return "Travel Research Agent"; }
    @Override public String getAgentRole() { return "Destination Specialist"; }
    @Override public int getExecutionOrder() { return 2; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destName = context.getTrip().getDestination();
        String destId = context.getTrip().getDestinationId();

        logInfo(task, "Researching destination attractions and regional highlights for: " + destName);
        long tStart = System.currentTimeMillis();
        List<Map<String, Object>> attractions = attractionTool.getAttractions(destId);
        recordToolCall(task, "AttractionTool.getAttractions", "destId=" + destId, "Found " + attractions.size() + " attractions", System.currentTimeMillis() - tStart, true);

        context.getResearchFindings().put("destination", destName);
        context.getResearchFindings().put("attractions", attractions);
        context.getResearchFindings().put("highlights", List.of("Historic architecture", "Scenic walking promenades", "Local food markets", "Sunset view decks"));
        context.getResearchFindings().put("bestTimeToVisit", "Spring to Autumn (pleasant weather, optimal outdoor activities)");
        context.getResearchFindings().put("culturalCustoms", "Tipping: 5-10% customary for good service. Dress modestly when visiting spiritual sites.");

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an expert travel researcher.",
                "Provide a brief 2-sentence summary of travel appeal for " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName);
        task.setOutputPayload("Discovered " + attractions.size() + " key attractions and cultural insights for " + destName);
    }
}
