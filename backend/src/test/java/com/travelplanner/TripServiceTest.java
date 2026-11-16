package com.travelplanner;

import com.travelplanner.agent.OrchestratorAgent;
import com.travelplanner.domain.model.Destination;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.DestinationRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.trip.TripCreateRequest;
import com.travelplanner.dto.trip.TripResponse;
import com.travelplanner.dto.trip.WizardTripRequest;
import com.travelplanner.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock private TripRepository tripRepository;
    @Mock private UserRepository userRepository;
    @Mock private DestinationRepository destinationRepository;
    @Mock private OrchestratorAgent orchestratorAgent;

    private TripService tripService;

    @BeforeEach
    void setUp() {
        tripService = new TripService(tripRepository, userRepository, destinationRepository, orchestratorAgent);
    }

    @Test
    void createTrip_Success_InvokesOrchestrator() {
        User user = new User();
        user.setId("u-123");
        user.setEmail("traveler@test.com");

        when(userRepository.findById("u-123")).thenReturn(Optional.of(user));

        Destination dest = new Destination();
        dest.setId("dest-paris");
        dest.setName("Paris");
        dest.setHeroImageUrl("https://image.url");
        when(destinationRepository.findByNameIgnoreCase("Paris")).thenReturn(Optional.of(dest));

        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip t = invocation.getArgument(0);
            t.setId("trip-generated-id");
            return t;
        });

        TripCreateRequest req = new TripCreateRequest(
                "Paris Getaway", "London", "Paris", "dest-paris",
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(14),
                2, 0, "COUPLE", BigDecimal.valueOf(2500), "EUR",
                "MODERATE", "BOUTIQUE", "DIRECT", "VEG", "Anniversary trip", null
        );

        TripResponse resp = tripService.createTrip("u-123", req);

        assertNotNull(resp);
        assertEquals("Paris Getaway", resp.title());
        assertEquals("Paris", resp.destination());
        assertEquals(5, resp.totalDays());
        verify(orchestratorAgent).planTrip("trip-generated-id", null);
    }

    @Test
    void wizardPlanTrip_NaturalLanguagePrompt_ExtractsEntities() {
        User user = new User();
        user.setId("u-123");
        when(userRepository.findById("u-123")).thenReturn(Optional.of(user));

        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip t = invocation.getArgument(0);
            t.setId("trip-wizard-id");
            return t;
        });

        WizardTripRequest wizardReq = new WizardTripRequest(
                "I want to travel from Mumbai to Goa for 5 days with budget 50000 and vegetarian food",
                null, null, null, null, 2, 1, "FAMILY", null, "INR",
                null, "RESORT", "TAXI", "VEGETARIAN", "BEACH", "RELAXED", "Kid friendly"
        );

        TripResponse resp = tripService.wizardPlanTrip("u-123", wizardReq);

        assertNotNull(resp);
        assertEquals("Goa", resp.destination());
        assertEquals("Mumbai", resp.origin());
        assertEquals(0, new BigDecimal("50000").compareTo(resp.budgetLimit()));
        verify(orchestratorAgent).planTrip("trip-wizard-id", wizardReq);
    }
}
