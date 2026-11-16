package com.travelplanner.service;

import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.common.exception.UnauthorizedException;
import com.travelplanner.domain.model.Itinerary;
import com.travelplanner.domain.model.ItineraryActivity;
import com.travelplanner.domain.model.ItineraryDay;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.repository.ItineraryActivityRepository;
import com.travelplanner.domain.repository.ItineraryDayRepository;
import com.travelplanner.domain.repository.ItineraryRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.dto.itinerary.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryDayRepository itineraryDayRepository;
    private final ItineraryActivityRepository itineraryActivityRepository;
    private final TripRepository tripRepository;

    public ItineraryService(
            ItineraryRepository itineraryRepository,
            ItineraryDayRepository itineraryDayRepository,
            ItineraryActivityRepository itineraryActivityRepository,
            TripRepository tripRepository) {
        this.itineraryRepository = itineraryRepository;
        this.itineraryDayRepository = itineraryDayRepository;
        this.itineraryActivityRepository = itineraryActivityRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional(readOnly = true)
    public ItineraryResponse getItineraryByTripId(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getUser().getId().equals(userId) && !trip.isPublic()) {
            throw new UnauthorizedException("You do not have permission to view this itinerary");
        }

        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found for trip: " + tripId));

        return mapToResponse(itinerary);
    }

    @Transactional
    public ItineraryActivityDto addActivity(String dayId, ActivityCreateRequest request, String userId) {
        ItineraryDay day = itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary day not found"));

        verifyOwnership(day.getItinerary().getTrip(), userId);

        ItineraryActivity act = new ItineraryActivity();
        act.setItineraryDay(day);
        act.setTitle(request.title());
        act.setTimeSlot(request.timeSlot() != null ? request.timeSlot() : "MORNING");
        act.setStartTime(request.startTime());
        act.setEndTime(request.endTime());
        act.setDescription(request.description());
        act.setLocationName(request.locationName());
        act.setLatitude(request.latitude());
        act.setLongitude(request.longitude());
        act.setActivityType(request.activityType() != null ? request.activityType() : "ATTRACTION");
        act.setEstimatedCost(request.estimatedCost() != null ? request.estimatedCost() : BigDecimal.ZERO);
        act.setCurrency(request.currency() != null ? request.currency() : "USD");
        act.setDurationMinutes(request.durationMinutes() != null ? request.durationMinutes() : 90);
        act.setTransportModeToNext(request.transportModeToNext());
        act.setTransportDurationToNextMinutes(request.transportDurationToNextMinutes());
        act.setOrderIndex(request.orderIndex() != null ? request.orderIndex() : day.getActivities().size() + 1);

        act = itineraryActivityRepository.save(act);
        return mapToActivityDto(act);
    }

    @Transactional
    public ItineraryActivityDto updateActivity(String activityId, ActivityUpdateRequest request, String userId) {
        ItineraryActivity act = itineraryActivityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        verifyOwnership(act.getItineraryDay().getItinerary().getTrip(), userId);

        if (request.title() != null) act.setTitle(request.title());
        if (request.timeSlot() != null) act.setTimeSlot(request.timeSlot());
        if (request.startTime() != null) act.setStartTime(request.startTime());
        if (request.endTime() != null) act.setEndTime(request.endTime());
        if (request.description() != null) act.setDescription(request.description());
        if (request.locationName() != null) act.setLocationName(request.locationName());
        if (request.latitude() != null) act.setLatitude(request.latitude());
        if (request.longitude() != null) act.setLongitude(request.longitude());
        if (request.activityType() != null) act.setActivityType(request.activityType());
        if (request.estimatedCost() != null) act.setEstimatedCost(request.estimatedCost());
        if (request.durationMinutes() != null) act.setDurationMinutes(request.durationMinutes());
        if (request.transportModeToNext() != null) act.setTransportModeToNext(request.transportModeToNext());
        if (request.transportDurationToNextMinutes() != null) act.setTransportDurationToNextMinutes(request.transportDurationToNextMinutes());
        if (request.orderIndex() != null) act.setOrderIndex(request.orderIndex());

        act = itineraryActivityRepository.save(act);
        return mapToActivityDto(act);
    }

    @Transactional
    public void deleteActivity(String activityId, String userId) {
        ItineraryActivity act = itineraryActivityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        verifyOwnership(act.getItineraryDay().getItinerary().getTrip(), userId);
        itineraryActivityRepository.delete(act);
    }

    @Transactional
    public void reorderActivities(ReorderActivitiesRequest request, String userId) {
        ItineraryDay day = itineraryDayRepository.findById(request.targetDayId())
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary day not found"));

        verifyOwnership(day.getItinerary().getTrip(), userId);

        List<String> ids = request.orderedActivityIds();
        for (int i = 0; i < ids.size(); i++) {
            String actId = ids.get(i);
            final int order = i + 1;
            itineraryActivityRepository.findById(actId).ifPresent(act -> {
                act.setItineraryDay(day);
                act.setOrderIndex(order);
                itineraryActivityRepository.save(act);
            });
        }
    }

    @Transactional
    public ItineraryDayDto regenerateDay(String dayId, String userId) {
        ItineraryDay day = itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary day not found"));

        verifyOwnership(day.getItinerary().getTrip(), userId);

        // Remove old activities
        List<ItineraryActivity> oldActs = itineraryActivityRepository.findByItineraryDayIdOrderByOrderIndexAsc(dayId);
        itineraryActivityRepository.deleteAll(oldActs);

        // Regenerate refreshed activities
        String dest = day.getItinerary().getTrip().getDestination();
        String curr = day.getItinerary().getTrip().getCurrency();

        ItineraryActivity morning = new ItineraryActivity();
        morning.setItineraryDay(day);
        morning.setTimeSlot("MORNING");
        morning.setStartTime("09:00");
        morning.setEndTime("11:30");
        morning.setTitle("Morning Discovery in " + dest);
        morning.setDescription("Refreshed morning excursion visiting landmark gardens and artisanal coffee spots.");
        morning.setLocationName(dest + " Landmark");
        morning.setActivityType("ATTRACTION");
        morning.setEstimatedCost(BigDecimal.valueOf(18.00));
        morning.setCurrency(curr);
        morning.setDurationMinutes(150);
        morning.setOrderIndex(1);
        morning.setTransportModeToNext("METRO");
        morning.setTransportDurationToNextMinutes(15);
        morning = itineraryActivityRepository.save(morning);

        ItineraryActivity afternoon = new ItineraryActivity();
        afternoon.setItineraryDay(day);
        afternoon.setTimeSlot("AFTERNOON");
        afternoon.setStartTime("12:00");
        afternoon.setEndTime("14:30");
        afternoon.setTitle("Local Gastronomy Tasting");
        afternoon.setDescription("Experience authentic regional delicacies and fresh seasonal produce.");
        afternoon.setLocationName(dest + " Culinary District");
        afternoon.setActivityType("DINING");
        afternoon.setEstimatedCost(BigDecimal.valueOf(35.00));
        afternoon.setCurrency(curr);
        afternoon.setDurationMinutes(90);
        afternoon.setOrderIndex(2);
        afternoon.setTransportModeToNext("WALKING");
        afternoon.setTransportDurationToNextMinutes(10);
        afternoon = itineraryActivityRepository.save(afternoon);

        ItineraryActivity evening = new ItineraryActivity();
        evening.setItineraryDay(day);
        evening.setTimeSlot("EVENING");
        evening.setStartTime("18:00");
        evening.setEndTime("21:00");
        evening.setTitle("Sunset Panorama & Evening Walk");
        evening.setDescription("Scenic dusk promenade with illuminated skyline vistas.");
        evening.setLocationName(dest + " Viewpoint");
        evening.setActivityType("LEISURE");
        evening.setEstimatedCost(BigDecimal.valueOf(25.00));
        evening.setCurrency(curr);
        evening.setDurationMinutes(180);
        evening.setOrderIndex(3);
        evening = itineraryActivityRepository.save(evening);

        day.getActivities().clear();
        day.getActivities().addAll(List.of(morning, afternoon, evening));
        return mapToDayDto(day);
    }

    private void verifyOwnership(Trip trip, String userId) {
        if (!trip.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this trip");
        }
    }

    private ItineraryResponse mapToResponse(Itinerary it) {
        List<ItineraryDayDto> dayDtos = new ArrayList<>();
        if (it.getDays() != null) {
            for (ItineraryDay d : it.getDays()) {
                dayDtos.add(mapToDayDto(d));
            }
        }

        return new ItineraryResponse(
                it.getId(),
                it.getTrip().getId(),
                it.getVersion(),
                it.getSummary(),
                it.getCriticScore(),
                it.getCriticFeedback(),
                it.isOptimized(),
                dayDtos,
                it.getCreatedAt(),
                it.getUpdatedAt()
        );
    }

    private ItineraryDayDto mapToDayDto(ItineraryDay d) {
        List<ItineraryActivityDto> actDtos = new ArrayList<>();
        if (d.getActivities() != null) {
            for (ItineraryActivity a : d.getActivities()) {
                actDtos.add(mapToActivityDto(a));
            }
        }

        return new ItineraryDayDto(
                d.getId(),
                d.getItinerary().getId(),
                d.getDayNumber(),
                d.getDate(),
                d.getTheme(),
                d.getWeatherSummary(),
                d.getNotes(),
                actDtos
        );
    }

    private ItineraryActivityDto mapToActivityDto(ItineraryActivity a) {
        return new ItineraryActivityDto(
                a.getId(),
                a.getItineraryDay().getId(),
                a.getTimeSlot(),
                a.getStartTime(),
                a.getEndTime(),
                a.getTitle(),
                a.getDescription(),
                a.getLocationName(),
                a.getLatitude(),
                a.getLongitude(),
                a.getActivityType(),
                a.getEstimatedCost(),
                a.getCurrency(),
                a.getDurationMinutes(),
                a.getTransportModeToNext(),
                a.getTransportDurationToNextMinutes(),
                a.getOrderIndex(),
                a.getBookingReference()
        );
    }
}
