package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, String> {
    Optional<Itinerary> findByTripId(String tripId);
}
