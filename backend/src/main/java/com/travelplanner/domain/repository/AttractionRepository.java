package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, String> {
    List<Attraction> findByDestinationId(String destinationId);
    List<Attraction> findByDestinationIdOrderByRatingDesc(String destinationId);
}
