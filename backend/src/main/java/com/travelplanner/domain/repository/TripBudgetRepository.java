package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.TripBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripBudgetRepository extends JpaRepository<TripBudget, String> {
    Optional<TripBudget> findByTripId(String tripId);
}
