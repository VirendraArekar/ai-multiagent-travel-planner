package com.travelplanner.agent;

import com.travelplanner.domain.model.Destination;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.dto.trip.WizardTripRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class AgentExecutionContext {

    private final String tripId;
    private final String userId;
    private final Trip trip;
    private final WizardTripRequest wizardRequest;
    private Destination destination;

    // Parallel agent findings
    private final Map<String, Object> researchFindings = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> flightOptions = new ArrayList<>();
    private final List<Map<String, Object>> hotelOptions = new ArrayList<>();
    private final Map<String, Object> weatherForecast = new ConcurrentHashMap<>();
    private final Map<String, Object> safetyReport = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> foodRecommendations = new ArrayList<>();
    private final List<Map<String, Object>> transitRecommendations = new ArrayList<>();

    // Synthesized planning state
    private final List<Map<String, Object>> dayPlans = new ArrayList<>();
    private final Map<String, BigDecimal> budgetBreakdown = new ConcurrentHashMap<>();
    private final Map<String, Object> criticEvaluation = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> bookingReferences = new ArrayList<>();

    // Execution state and metrics
    private int revisionCount = 0;
    private int maxRevisions = 2;
    private boolean requiresRevision = false;
    private String criticNotes = "";
    private long totalDurationMs = 0;
    private int totalTokensUsed = 0;
    private BigDecimal totalCostUsd = BigDecimal.ZERO;

    public AgentExecutionContext(Trip trip, WizardTripRequest wizardRequest) {
        this.trip = trip;
        this.tripId = trip != null ? trip.getId() : null;
        this.userId = trip != null && trip.getUser() != null ? trip.getUser().getId() : null;
        this.wizardRequest = wizardRequest;
    }

    // Getters and helper methods
    public String getTripId() { return tripId; }
    public String getUserId() { return userId; }
    public Trip getTrip() { return trip; }
    public WizardTripRequest getWizardRequest() { return wizardRequest; }
    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    public Map<String, Object> getResearchFindings() { return researchFindings; }
    public List<Map<String, Object>> getFlightOptions() { return flightOptions; }
    public List<Map<String, Object>> getHotelOptions() { return hotelOptions; }
    public Map<String, Object> getWeatherForecast() { return weatherForecast; }
    public Map<String, Object> getSafetyReport() { return safetyReport; }
    public List<Map<String, Object>> getFoodRecommendations() { return foodRecommendations; }
    public List<Map<String, Object>> getTransitRecommendations() { return transitRecommendations; }

    public List<Map<String, Object>> getDayPlans() { return dayPlans; }
    public Map<String, BigDecimal> getBudgetBreakdown() { return budgetBreakdown; }
    public Map<String, Object> getCriticEvaluation() { return criticEvaluation; }
    public List<Map<String, Object>> getBookingReferences() { return bookingReferences; }

    public int getRevisionCount() { return revisionCount; }
    public void incrementRevisionCount() { this.revisionCount++; }
    public int getMaxRevisions() { return maxRevisions; }
    public boolean isRequiresRevision() { return requiresRevision; }
    public void setRequiresRevision(boolean requiresRevision) { this.requiresRevision = requiresRevision; }
    public String getCriticNotes() { return criticNotes; }
    public void setCriticNotes(String criticNotes) { this.criticNotes = criticNotes; }

    public synchronized void recordMetrics(long durationMs, int tokens, BigDecimal cost) {
        this.totalDurationMs += durationMs;
        this.totalTokensUsed += tokens;
        if (cost != null) {
            this.totalCostUsd = this.totalCostUsd.add(cost);
        }
    }

    public long getTotalDurationMs() { return totalDurationMs; }
    public int getTotalTokensUsed() { return totalTokensUsed; }
    public BigDecimal getTotalCostUsd() { return totalCostUsd; }
}
