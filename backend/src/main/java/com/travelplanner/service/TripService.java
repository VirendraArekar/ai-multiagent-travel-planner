package com.travelplanner.service;

import com.travelplanner.agent.OrchestratorAgent;
import com.travelplanner.common.exception.BadRequestException;
import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.common.exception.UnauthorizedException;
import com.travelplanner.domain.model.Destination;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.DestinationRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.trip.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final OrchestratorAgent orchestratorAgent;

    public TripService(
            TripRepository tripRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository,
            OrchestratorAgent orchestratorAgent) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.orchestratorAgent = orchestratorAgent;
    }

    @Transactional
    public TripResponse createTrip(String userId, TripCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(request.title());
        trip.setOrigin(request.origin());
        trip.setDestination(request.destination());
        trip.setDestinationId(request.destinationId());
        trip.setStartDate(request.startDate());
        trip.setEndDate(request.endDate());

        long days = ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;
        trip.setTotalDays(Math.max(1, (int) days));
        trip.setAdultsCount(request.adultsCount() != null ? request.adultsCount() : 1);
        trip.setChildrenCount(request.childrenCount() != null ? request.childrenCount() : 0);
        trip.setTravelType(request.travelType() != null ? request.travelType() : "SOLO");
        trip.setBudgetLimit(request.budgetLimit());
        trip.setCurrency(request.currency() != null ? request.currency() : "USD");
        trip.setPace(request.pace() != null ? request.pace() : "MODERATE");
        trip.setStatus("PLANNED");
        trip.setNotes(request.notes());

        assignDestinationHeroImage(trip);

        trip = tripRepository.save(trip);

        // Run multi-agent orchestrator
        orchestratorAgent.planTrip(trip.getId(), null);

        return mapToResponse(trip);
    }

    @Transactional
    public TripResponse wizardPlanTrip(String userId, WizardTripRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String origin = request.startingLocation();
        String destination = request.destination();
        LocalDate start = request.departureDate();
        LocalDate end = request.returnDate();
        int adults = request.adults() != null ? request.adults() : 1;
        int children = request.children() != null ? request.children() : 0;
        String travelType = request.travelType() != null ? request.travelType() : "SOLO";
        BigDecimal budget = request.budgetRange();
        String currency = request.currency() != null ? request.currency() : "USD";

        // If natural language prompt was provided, parse out any missing entities
        if (StringUtils.hasText(request.naturalLanguagePrompt())) {
            String prompt = request.naturalLanguagePrompt();
            if (!StringUtils.hasText(destination)) {
                destination = extractDestinationFromPrompt(prompt);
            }
            if (!StringUtils.hasText(origin)) {
                origin = extractOriginFromPrompt(prompt);
            }
            if (budget == null) {
                budget = extractBudgetFromPrompt(prompt);
            }
        }

        if (!StringUtils.hasText(destination)) {
            destination = "Paris"; // Fallback destination
        }
        if (!StringUtils.hasText(origin)) {
            origin = "New York (JFK)";
        }
        if (start == null) {
            start = LocalDate.now().plusDays(14);
        }
        if (end == null) {
            end = start.plusDays(4);
        }

        long days = ChronoUnit.DAYS.between(start, end) + 1;

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(destination + " Vacation - " + travelType);
        trip.setOrigin(origin);
        trip.setDestination(destination);
        trip.setStartDate(start);
        trip.setEndDate(end);
        trip.setTotalDays(Math.max(1, (int) days));
        trip.setAdultsCount(adults);
        trip.setChildrenCount(children);
        trip.setTravelType(travelType);
        trip.setBudgetLimit(budget);
        trip.setCurrency(currency);
        trip.setStatus("PLANNING");
        trip.setNotes("Wizard planned: " + (request.naturalLanguagePrompt() != null ? request.naturalLanguagePrompt() : "Custom preferences"));

        assignDestinationHeroImage(trip);

        trip = tripRepository.save(trip);

        // Trigger the multi-agent orchestrator
        orchestratorAgent.planTrip(trip.getId(), request);

        return mapToResponse(trip);
    }

    private void assignDestinationHeroImage(Trip trip) {
        destinationRepository.findByNameIgnoreCase(trip.getDestination()).ifPresent(d -> {
            trip.setDestinationId(d.getId());
            trip.setHeroImageUrl(d.getHeroImageUrl());
        });
        if (trip.getHeroImageUrl() == null) {
            trip.setHeroImageUrl("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80");
        }
    }

    private String extractDestinationFromPrompt(String prompt) {
        Pattern fromToPattern = Pattern.compile("(?i)from\\s+([A-Za-z\\s]+?)\\s+to\\s+([A-Za-z\\s]+?)(?:\\s+for|\\s+with|\\s+budget|\\s+next|\\.|$)");
        Matcher fromToMatcher = fromToPattern.matcher(prompt);
        if (fromToMatcher.find()) {
            return fromToMatcher.group(2).trim();
        }

        Pattern pattern = Pattern.compile("(?i)\\bto\\s+([A-Za-z\\s]+?)(?:\\s+for|\\s+with|\\s+budget|\\s+next|\\.|$)");
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            String candidate = matcher.group(1).trim();
            if (!candidate.startsWith("travel") && !candidate.startsWith("go")) {
                return candidate;
            }
        }
        return "Goa";
    }

    private String extractOriginFromPrompt(String prompt) {
        Pattern pattern = Pattern.compile("(?i)from\\s+([A-Za-z\\s]+?)(?:\\s+to|\\s+for|\\.|$)");
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "Mumbai";
    }

    private BigDecimal extractBudgetFromPrompt(String prompt) {
        Pattern pattern = Pattern.compile("(?i)(?:budget|under|around)\\s*(?:₹|\\$|€|INR|USD)?\\s*([0-9,]+)");
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            try {
                String val = matcher.group(1).replace(",", "");
                return new BigDecimal(val);
            } catch (Exception ignored) {}
        }
        return BigDecimal.valueOf(50000.00);
    }

    @Transactional(readOnly = true)
    public TripResponse getTripById(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getUser().getId().equals(userId) && !trip.isPublic()) {
            throw new UnauthorizedException("You do not have permission to view this trip");
        }

        return mapToResponse(trip);
    }

    @Transactional(readOnly = true)
    public Page<TripSummaryDto> getUserTrips(String userId, Pageable pageable) {
        return tripRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToSummary);
    }

    @Transactional
    public TripResponse updateTrip(String tripId, String userId, TripUpdateRequest request) {
        Trip trip = tripRepository.findByIdAndUserIdAndDeletedFalse(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (request.title() != null) trip.setTitle(request.title());
        if (request.destination() != null) trip.setDestination(request.destination());
        if (request.startDate() != null) trip.setStartDate(request.startDate());
        if (request.endDate() != null) trip.setEndDate(request.endDate());
        if (request.startDate() != null && request.endDate() != null) {
            trip.setTotalDays((int) ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1);
        }
        if (request.adultsCount() != null) trip.setAdultsCount(request.adultsCount());
        if (request.childrenCount() != null) trip.setChildrenCount(request.childrenCount());
        if (request.travelType() != null) trip.setTravelType(request.travelType());
        if (request.budgetLimit() != null) trip.setBudgetLimit(request.budgetLimit());
        if (request.currency() != null) trip.setCurrency(request.currency());
        if (request.pace() != null) trip.setPace(request.pace());
        if (request.status() != null) trip.setStatus(request.status());
        if (request.notes() != null) trip.setNotes(request.notes());
        if (request.isPublic() != null) trip.setPublic(request.isPublic());

        trip = tripRepository.save(trip);
        return mapToResponse(trip);
    }

    @Transactional
    public void deleteTrip(String tripId, String userId) {
        Trip trip = tripRepository.findByIdAndUserIdAndDeletedFalse(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        trip.setDeleted(true);
        tripRepository.save(trip);
    }

    @Transactional
    public TripResponse duplicateTrip(String tripId, String userId) {
        Trip original = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip copy = new Trip();
        copy.setUser(user);
        copy.setTitle(original.getTitle() + " (Copy)");
        copy.setOrigin(original.getOrigin());
        copy.setDestination(original.getDestination());
        copy.setDestinationId(original.getDestinationId());
        copy.setStartDate(LocalDate.now().plusDays(30));
        copy.setEndDate(LocalDate.now().plusDays(30 + original.getTotalDays() - 1));
        copy.setTotalDays(original.getTotalDays());
        copy.setAdultsCount(original.getAdultsCount());
        copy.setChildrenCount(original.getChildrenCount());
        copy.setTravelType(original.getTravelType());
        copy.setBudgetLimit(original.getBudgetLimit());
        copy.setCurrency(original.getCurrency());
        copy.setPace(original.getPace());
        copy.setStatus("PLANNED");
        copy.setHeroImageUrl(original.getHeroImageUrl());

        copy = tripRepository.save(copy);
        orchestratorAgent.planTrip(copy.getId(), null);

        return mapToResponse(copy);
    }

    @Transactional(readOnly = true)
    public TripResponse getPublicTripByShareToken(String shareToken) {
        Trip trip = tripRepository.findByShareTokenAndDeletedFalse(shareToken)
                .orElseThrow(() -> new ResourceNotFoundException("Shared trip not found or link has expired"));

        return mapToResponse(trip);
    }

    private TripResponse mapToResponse(Trip t) {
        return new TripResponse(
                t.getId(),
                t.getUser().getId(),
                t.getTitle(),
                t.getOrigin(),
                t.getDestination(),
                t.getDestinationId(),
                t.getStartDate(),
                t.getEndDate(),
                t.getTotalDays(),
                t.getAdultsCount(),
                t.getChildrenCount(),
                t.getTravelType(),
                t.getBudgetLimit(),
                t.getCurrency(),
                t.getPace(),
                t.getStatus(),
                t.getNotes(),
                t.getHeroImageUrl(),
                t.isPublic(),
                t.getShareToken(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }

    private TripSummaryDto mapToSummary(Trip t) {
        BigDecimal estCost = t.getBudget() != null ? t.getBudget().getTotalBudget() : t.getBudgetLimit();
        int actsCount = 0;
        if (t.getItinerary() != null && t.getItinerary().getDays() != null) {
            actsCount = t.getItinerary().getDays().stream()
                    .mapToInt(d -> d.getActivities() != null ? d.getActivities().size() : 0)
                    .sum();
        }

        return new TripSummaryDto(
                t.getId(),
                t.getTitle(),
                t.getOrigin(),
                t.getDestination(),
                t.getStartDate(),
                t.getEndDate(),
                t.getTotalDays(),
                t.getTravelType(),
                t.getStatus(),
                t.getHeroImageUrl(),
                t.getBudgetLimit(),
                t.getCurrency(),
                estCost,
                actsCount,
                t.getShareToken()
        );
    }
}
