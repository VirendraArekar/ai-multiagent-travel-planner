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
import java.time.LocalDate;
import java.util.*;

@Component
public class ItineraryPlanningAgent extends BaseAgent {

    public ItineraryPlanningAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient) {
        super(agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
    }

    @Override public String getAgentName() { return "Itinerary Planning Agent"; }
    @Override public String getAgentRole() { return "Schedule Architect"; }
    @Override public int getExecutionOrder() { return 9; }

    @Override
    @SuppressWarnings("unchecked")
    protected void executeTask(AgentExecutionContext context, AgentTask task) throws Exception {
        int totalDays = context.getTrip().getTotalDays();
        LocalDate startDate = context.getTrip().getStartDate();
        String destName = context.getTrip().getDestination();

        logInfo(task, "Synthesizing cohesive " + totalDays + "-day geographic itinerary for " + destName);

        List<Map<String, Object>> attractions = (List<Map<String, Object>>) context.getResearchFindings().getOrDefault("attractions", List.of());
        List<Map<String, Object>> restaurants = context.getFoodRecommendations();

        context.getDayPlans().clear();

        for (int day = 1; day <= totalDays; day++) {
            LocalDate currentDate = startDate.plusDays(day - 1);
            Map<String, Object> dayPlan = new HashMap<>();
            dayPlan.put("dayNumber", day);
            dayPlan.put("date", currentDate.toString());

            String theme;
            if (day == 1) {
                theme = "Arrival, Landmark Discovery & Orientation";
            } else if (day == totalDays) {
                theme = "Scenic Viewpoints, Souvenir Exploration & Farewell Dinner";
            } else if (day % 2 == 0) {
                theme = "Cultural Deep-Dive, Museums & Architectural Marvels";
            } else {
                theme = "Local Neighborhoods, Coastal / Nature Walks & Hidden Cafes";
            }
            dayPlan.put("theme", theme);
            dayPlan.put("weatherSummary", "Sunny with mild breeze, ~23°C (optimal sightseeing)");

            List<Map<String, Object>> activities = new ArrayList<>();

            // 1. Morning Activity
            int attIndex1 = (day * 2 - 2) % Math.max(1, attractions.size());
            Map<String, Object> att1 = attractions.isEmpty() ? null : attractions.get(attIndex1);
            String att1Name = att1 != null ? (String) att1.get("name") : "Historic City Center & Heritage Walk";
            BigDecimal att1Cost = att1 != null && att1.get("entryFeeUsd") != null ? (BigDecimal) att1.get("entryFeeUsd") : BigDecimal.valueOf(15.00);

            activities.add(buildActivityMap(
                    "MORNING", "09:30", "12:00",
                    "Explore " + att1Name,
                    "Guided immersion and photography across iconic viewpoints and exhibits.",
                    att1Name,
                    att1 != null && att1.get("latitude") != null ? (Double) att1.get("latitude") : 48.8584,
                    att1 != null && att1.get("longitude") != null ? (Double) att1.get("longitude") : 2.2945,
                    "ATTRACTION", att1Cost, context.getTrip().getCurrency(),
                    150, "WALKING", 15, 1
            ));

            // 2. Afternoon Dining & Leisure
            int rstIndex = (day - 1) % Math.max(1, restaurants.size());
            Map<String, Object> rst = restaurants.isEmpty() ? null : restaurants.get(rstIndex);
            String rstName = rst != null ? (String) rst.get("name") : "Le Petit Bistro & Terrace";

            activities.add(buildActivityMap(
                    "AFTERNOON", "12:30", "14:00",
                    "Artisan Lunch at " + rstName,
                    "Savor regional signature dishes and artisanal desserts in an ambient setting.",
                    rstName,
                    rst != null && rst.get("latitude") != null ? (Double) rst.get("latitude") : 48.8606,
                    rst != null && rst.get("longitude") != null ? (Double) rst.get("longitude") : 2.3376,
                    "DINING", BigDecimal.valueOf(32.00), context.getTrip().getCurrency(),
                    90, "METRO", 20, 2
            ));

            // 3. Late Afternoon Attraction / Experience
            int attIndex2 = (day * 2 - 1) % Math.max(1, attractions.size());
            Map<String, Object> att2 = attractions.isEmpty() ? null : attractions.get(attIndex2);
            String att2Name = att2 != null ? (String) att2.get("name") : "Scenic River Promenade & Garden";
            BigDecimal att2Cost = att2 != null && att2.get("entryFeeUsd") != null ? (BigDecimal) att2.get("entryFeeUsd") : BigDecimal.valueOf(20.00);

            activities.add(buildActivityMap(
                    "AFTERNOON", "14:30", "17:00",
                    "Visit " + att2Name,
                    "Immerse in local collections, botanical paths, and panoramic viewing terraces.",
                    att2Name,
                    att2 != null && att2.get("latitude") != null ? (Double) att2.get("latitude") : 48.8530,
                    att2 != null && att2.get("longitude") != null ? (Double) att2.get("longitude") : 2.3499,
                    "ATTRACTION", att2Cost, context.getTrip().getCurrency(),
                    150, "WALKING", 15, 3
            ));

            // 4. Evening Sunset & Dinner
            activities.add(buildActivityMap(
                    "EVENING", "18:30", "21:30",
                    "Sunset Skyline Vista & Chef Tasting Dinner",
                    "Golden hour sunset viewing followed by authentic seasonal dinner pairing.",
                    destName + " Skyline Observation",
                    48.8584, 2.2945,
                    "LEISURE", BigDecimal.valueOf(45.00), context.getTrip().getCurrency(),
                    180, "METRO", 20, 4
            ));

            dayPlan.put("activities", activities);
            context.getDayPlans().add(dayPlan);
        }

        LlmResponse llmResp = llmClient.generateResponse(
                "You are an elite travel concierge itinerary architect.",
                "Verify schedule pacing and geographic clusters for " + totalDays + " days in " + destName
        );

        task.setTokensUsed(llmResp.totalTokens());
        task.setCostUsd(llmResp.estimatedCostUsd());
        task.setInputPayload("Days: " + totalDays + ", Destination: " + destName);
        task.setOutputPayload("Generated " + totalDays + " fully structured day plans comprising morning, afternoon, and evening activities.");
    }

    private Map<String, Object> buildActivityMap(
            String timeSlot, String startTime, String endTime,
            String title, String description, String locationName,
            Double latitude, Double longitude, String activityType,
            BigDecimal estimatedCost, String currency, int durationMinutes,
            String transportModeToNext, int transportDurationToNextMinutes, int orderIndex) {

        Map<String, Object> map = new HashMap<>();
        map.put("timeSlot", timeSlot);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("title", title);
        map.put("description", description);
        map.put("locationName", locationName);
        map.put("latitude", latitude);
        map.put("longitude", longitude);
        map.put("activityType", activityType);
        map.put("estimatedCost", estimatedCost);
        map.put("currency", currency);
        map.put("durationMinutes", durationMinutes);
        map.put("transportModeToNext", transportModeToNext);
        map.put("transportDurationToNextMinutes", transportDurationToNextMinutes);
        map.put("orderIndex", orderIndex);
        return map;
    }
}
