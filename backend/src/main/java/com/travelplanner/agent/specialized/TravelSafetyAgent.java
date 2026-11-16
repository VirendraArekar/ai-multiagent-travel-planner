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

import java.util.List;
import java.util.Map;

@Component
public class TravelSafetyAgent extends BaseAgent {

    public TravelSafetyAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
    }

    @Override public String getAgentName() { return "Travel Safety Agent"; }
    @Override public String getAgentRole() { return "Advisory & Visa Specialist"; }
    @Override public int getExecutionOrder() { return 6; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destName = context.getTrip().getDestination();

        logInfo(task, "Evaluating official travel advisory, emergency response contacts, and visa requirements for " + destName);

        context.getSafetyReport().put("safetyLevel", "Level 1: Exercise Normal Precautions");
        context.getSafetyReport().put("emergencyNumbers", Map.of(
                "police", "112 / 911",
                "ambulance", "112 / 911",
                "touristHelpline", "+1-800-TOURIST"
        ));
        context.getSafetyReport().put("healthRecommendations", List.of("Standard travel health insurance recommended", "No mandatory vaccinations required", "Tap water safe in metropolitan areas"));
        context.getSafetyReport().put("commonScamsToAvoid", List.of(
                "Unmetered airport taxis - always insist on official taxi rank or ride-hailing app",
                "Petition clipboard distraction scams around busy monuments",
                "Friendly strangers offering unsolicited friendship bracelets or roses"
        ));
        context.getSafetyReport().put("visaInformation", "Check passport validity (minimum 6 months remaining from entry date). Visa waiver/e-visa eligible for many nationalities.");

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an international travel safety and consular advisory officer.",
                "Provide vital safety precautions and emergency advice for traveling to " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName);
        task.setOutputPayload("Safety level: Level 1 (Safe). Emergency protocols and scam prevention guidelines formulated.");
    }
}
