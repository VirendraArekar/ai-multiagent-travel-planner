package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.FlightSearchTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class FlightSearchAgent extends BaseAgent {

    private final FlightSearchTool flightSearchTool;

    public FlightSearchAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            FlightSearchTool flightSearchTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.flightSearchTool = flightSearchTool;
    }

    @Override public String getAgentName() { return "Flight Search Agent"; }
    @Override public String getAgentRole() { return "Aviation Specialist"; }
    @Override public int getExecutionOrder() { return 3; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String origin = context.getTrip().getOrigin();
        String destination = context.getTrip().getDestination();

        logInfo(task, "Searching verified flights from " + origin + " to " + destination);
        long tStart = System.currentTimeMillis();
        List<Map<String, Object>> flights = flightSearchTool.searchFlights(origin, destination);
        recordToolCall(task, "FlightSearchTool.searchFlights", "origin=" + origin + ", dest=" + destination, "Retrieved " + flights.size() + " flights", System.currentTimeMillis() - tStart, true);

        context.getFlightOptions().clear();
        context.getFlightOptions().addAll(flights);

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an airline route optimization expert.",
                "Summarize best flight options from " + origin + " to " + destination + " considering duration and luggage."
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Origin: " + origin + ", Destination: " + destination);
        task.setOutputPayload("Discovered " + flights.size() + " flight alternatives. Best option duration: " +
                (flights.isEmpty() ? "N/A" : flights.get(0).get("durationMinutes") + " mins"));
    }
}
