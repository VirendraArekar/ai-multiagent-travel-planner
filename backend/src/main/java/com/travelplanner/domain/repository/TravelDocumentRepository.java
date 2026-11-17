package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.TravelDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelDocumentRepository extends JpaRepository<TravelDocument, String> {
    List<TravelDocument> findByTripId(String tripId);
    List<TravelDocument> findByUserId(String userId);
}
