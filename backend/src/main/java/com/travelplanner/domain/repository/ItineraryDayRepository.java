package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, String> {
    List<ItineraryDay> findByItineraryIdOrderByDayNumberAsc(String itineraryId);
}
