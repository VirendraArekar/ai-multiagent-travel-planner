package com.travelplanner.agent.specialized;

import com.travelplanner.agent.AgentExecutionContext;
import com.travelplanner.agent.BaseAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.tools.CurrencyConverterTool;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Component
public class BudgetManagementAgent extends BaseAgent {

    private final CurrencyConverterTool currencyConverterTool;

    public BudgetManagementAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient,
            CurrencyConverterTool currencyConverterTool) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        this.currencyConverterTool = currencyConverterTool;
    }

    @Override public String getAgentName() { return "Budget Management Agent"; }
    @Override public String getAgentRole() { return "Financial Analyst"; }
    @Override public int getExecutionOrder() { return 10; }

    @Override
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        int days = context.getTrip().getTotalDays();
        int travelers = context.getTrip().getAdultsCount() + context.getTrip().getChildrenCount();
        String currency = context.getTrip().getCurrency() != null ? context.getTrip().getCurrency() : "USD";

        logInfo(task, "Calculating comprehensive line-item expense allocation in " + currency);

        // 1. Flights estimate
        BigDecimal flightPerPerson = BigDecimal.valueOf(450.00);
        if (!context.getFlightOptions().isEmpty()) {
            Object priceObj = context.getFlightOptions().get(0).get("priceUsd");
            if (priceObj instanceof BigDecimal bd) {
                flightPerPerson = bd;
            } else if (priceObj instanceof Number num) {
                flightPerPerson = BigDecimal.valueOf(num.doubleValue());
            }
        }
        BigDecimal flightsTotalUsd = flightPerPerson.multiply(BigDecimal.valueOf(travelers));

        // 2. Hotel estimate
        BigDecimal hotelPerNightUsd = BigDecimal.valueOf(140.00);
        if (!context.getHotelOptions().isEmpty()) {
            Object priceObj = context.getHotelOptions().get(0).get("pricePerNightUsd");
            if (priceObj instanceof BigDecimal bd) {
                hotelPerNightUsd = bd;
            } else if (priceObj instanceof Number num) {
                hotelPerNightUsd = BigDecimal.valueOf(num.doubleValue());
            }
        }
        BigDecimal hotelTotalUsd = hotelPerNightUsd.multiply(BigDecimal.valueOf(Math.max(1, days - 1)));

        // 3. Transit estimate
        BigDecimal transitPerDayUsd = BigDecimal.valueOf(25.00);
        BigDecimal transitTotalUsd = transitPerDayUsd.multiply(BigDecimal.valueOf(days * travelers));

        // 4. Food estimate
        BigDecimal foodPerPersonPerDayUsd = BigDecimal.valueOf(55.00);
        BigDecimal foodTotalUsd = foodPerPersonPerDayUsd.multiply(BigDecimal.valueOf(days * travelers));

        // 5. Activities estimate
        BigDecimal activitiesPerPersonPerDayUsd = BigDecimal.valueOf(35.00);
        BigDecimal activitiesTotalUsd = activitiesPerPersonPerDayUsd.multiply(BigDecimal.valueOf(days * travelers));

        // 6. Emergency Buffer (10%)
        BigDecimal subtotalUsd = flightsTotalUsd.add(hotelTotalUsd).add(transitTotalUsd).add(foodTotalUsd).add(activitiesTotalUsd);
        BigDecimal emergencyUsd = subtotalUsd.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalCalculatedUsd = subtotalUsd.add(emergencyUsd);

        // Convert to trip currency
        BigDecimal flightsAllocated = currencyConverterTool.convert(flightsTotalUsd, "USD", currency);
        BigDecimal hotelsAllocated = currencyConverterTool.convert(hotelTotalUsd, "USD", currency);
        BigDecimal transportAllocated = currencyConverterTool.convert(transitTotalUsd, "USD", currency);
        BigDecimal foodAllocated = currencyConverterTool.convert(foodTotalUsd, "USD", currency);
        BigDecimal activitiesAllocated = currencyConverterTool.convert(activitiesTotalUsd, "USD", currency);
        BigDecimal emergencyAllocated = currencyConverterTool.convert(emergencyUsd, "USD", currency);
        BigDecimal totalBudget = currencyConverterTool.convert(totalCalculatedUsd, "USD", currency);

        context.getBudgetBreakdown().put("flights", flightsAllocated);
        context.getBudgetBreakdown().put("hotels", hotelsAllocated);
        context.getBudgetBreakdown().put("transport", transportAllocated);
        context.getBudgetBreakdown().put("food", foodAllocated);
        context.getBudgetBreakdown().put("activities", activitiesAllocated);
        context.getBudgetBreakdown().put("emergency", emergencyAllocated);
        context.getBudgetBreakdown().put("totalBudget", totalBudget);

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an expert travel accountant and cost-saving strategist.",
                "Provide budget recommendations and tips to save 15% on accommodation and dining for this trip."
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Travelers: " + travelers + ", Days: " + days + ", Currency: " + currency);
        task.setOutputPayload("Total Estimated Budget: " + currency + " " + totalBudget +
                " (Flights: " + flightsAllocated + ", Hotels: " + hotelsAllocated + ", Dining: " + foodAllocated + ")");
    }
}
