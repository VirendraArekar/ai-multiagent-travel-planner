package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.WeatherTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WeatherAgent extends BaseAgent {

    private final WeatherTool weatherTool;

    public WeatherAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            WeatherTool weatherTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.weatherTool = weatherTool;
    }

    @Override public String getAgentName() { return "Weather Agent"; }
    @Override public String getAgentRole() { return "Meteorological Specialist"; }
    @Override public int getExecutionOrder() { return 5; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        String destName = context.getTrip().getDestination();
        int totalDays = context.getTrip().getTotalDays();

        logInfo(task, "Analyzing meteorological forecast for " + destName + " over " + totalDays + " days.");
        long tStart = System.currentTimeMillis();
        Map<String, Object> forecast = weatherTool.getWeatherForecast(destName, totalDays);
        recordToolCall(task, "WeatherTool.getWeatherForecast", "dest=" + destName, "Retrieved forecast", System.currentTimeMillis() - tStart, true);

        context.getWeatherForecast().clear();
        context.getWeatherForecast().putAll(forecast);

        LlmResponse llmResp = llmClient.generateResponse(
                "You are a travel meteorologist.",
                "Provide weather assessment and packing checklist for " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Destination: " + destName + ", Days: " + totalDays);
        task.setOutputPayload("Forecast: " + forecast.get("condition") + ", " + forecast.get("averageTemperatureC") + "°C. Packing: " + forecast.get("packingSuggestions"));
    }
}
