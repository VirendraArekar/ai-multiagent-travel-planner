package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.ItineraryActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryActivityRepository extends JpaRepository<ItineraryActivity, String> {
    List<ItineraryActivity> findByItineraryDayIdOrderByOrderIndexAsc(String itineraryDayId);
}
