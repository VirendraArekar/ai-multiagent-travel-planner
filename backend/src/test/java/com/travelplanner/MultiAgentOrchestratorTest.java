package com.travelplanner;

import com.travelplanner.agent.AgentRegistry;
import com.travelplanner.agent.OrchestratorAgent;
import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.agent.llm.LlmResponse;
import com.travelplanner.agent.specialized.*;
import com.travelplanner.agent.tools.*;
import com.travelplanner.domain.model.*;
import com.travelplanner.domain.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MultiAgentOrchestratorTest {

    @Mock private AgentRepository agentRepository;
    @Mock private AgentTaskRepository agentTaskRepository;
    @Mock private AgentExecutionLogRepository agentLogRepository;
    @Mock private AgentToolCallRepository agentToolCallRepository;
    @Mock private TripRepository tripRepository;
    @Mock private ItineraryRepository itineraryRepository;
    @Mock private ItineraryDayRepository itineraryDayRepository;
    @Mock private ItineraryActivityRepository itineraryActivityRepository;
    @Mock private TripBudgetRepository tripBudgetRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private LlmClient llmClient;

    @Mock private AttractionTool attractionTool;
    @Mock private FlightSearchTool flightSearchTool;
    @Mock private HotelSearchTool hotelSearchTool;
    @Mock private WeatherTool weatherTool;
    @Mock private RestaurantTool restaurantTool;
    @Mock private CurrencyConverterTool currencyConverterTool;

    private OrchestratorAgent orchestratorAgent;

    @BeforeEach
    void setUp() {
        when(llmClient.generateResponse(any(), any()))
                .thenReturn(LlmResponse.of("Test agent synthesis", 100, 200));

        TravelResearchAgent researchAgent = new TravelResearchAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, attractionTool);
        FlightSearchAgent flightAgent = new FlightSearchAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, flightSearchTool);
        HotelRecommendationAgent hotelAgent = new HotelRecommendationAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, hotelSearchTool);
        WeatherAgent weatherAgentComp = new WeatherAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, weatherTool);
        TravelSafetyAgent safetyAgent = new TravelSafetyAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        FoodRestaurantAgent foodAgent = new FoodRestaurantAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, restaurantTool);
        TransportationAgent transportAgent = new TransportationAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        ItineraryPlanningAgent itineraryAgent = new ItineraryPlanningAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        BudgetManagementAgent budgetAgent = new BudgetManagementAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient, currencyConverterTool);
        TravelCriticAgent criticAgent = new TravelCriticAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);
        BookingAssistantAgent bookingAgent = new BookingAssistantAgent(
                agentRepository, agentTaskRepository, agentLogRepository, agentToolCallRepository, llmClient);

        AgentRegistry registry = new AgentRegistry(List.of(
                researchAgent, flightAgent, hotelAgent, weatherAgentComp, safetyAgent,
                foodAgent, transportAgent, itineraryAgent, budgetAgent, criticAgent, bookingAgent
        ));

        orchestratorAgent = new OrchestratorAgent(
                registry, agentRepository, agentTaskRepository, agentLogRepository,
                tripRepository, itineraryRepository, itineraryDayRepository, itineraryActivityRepository,
                tripBudgetRepository, bookingRepository, notificationRepository, llmClient,
                researchAgent, flightAgent, hotelAgent, weatherAgentComp, safetyAgent,
                foodAgent, transportAgent, itineraryAgent, budgetAgent, criticAgent, bookingAgent
        );
    }

    @Test
    void planTrip_ExecutesMultiAgentPipeline_Success() {
        User user = new User();
        user.setId("u-1");
        user.setEmail("user@test.com");
        user.setFirstName("User");

        Trip trip = new Trip();
        trip.setId("trip-test-1");
        trip.setUser(user);
        trip.setTitle("Tokyo Adventure");
        trip.setOrigin("San Francisco");
        trip.setDestination("Tokyo");
        trip.setStartDate(LocalDate.now().plusDays(20));
        trip.setEndDate(LocalDate.now().plusDays(22));
        trip.setTotalDays(3);
        trip.setAdultsCount(2);
        trip.setChildrenCount(0);
        trip.setCurrency("USD");
        trip.setStatus("PLANNED");

        when(tripRepository.findById("trip-test-1")).thenReturn(Optional.of(trip));
        when(agentTaskRepository.save(any(AgentTask.class))).thenAnswer(i -> i.getArgument(0));
        when(itineraryRepository.save(any(Itinerary.class))).thenAnswer(i -> i.getArgument(0));
        when(itineraryDayRepository.save(any(ItineraryDay.class))).thenAnswer(i -> i.getArgument(0));
        when(currencyConverterTool.convert(any(), any(), any())).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> orchestratorAgent.planTrip("trip-test-1", null));

        assertEquals("PLANNED", trip.getStatus());
        verify(itineraryRepository).save(any(Itinerary.class));
        verify(tripBudgetRepository).save(any(TripBudget.class));
        verify(notificationRepository).save(any(Notification.class));
    }
}
