package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, String>, JpaSpecificationExecutor<Hotel> {
    List<Hotel> findByDestinationId(String destinationId);
    List<Hotel> findByDestinationIdOrderByUserRatingDesc(String destinationId);
    List<Hotel> findByDestinationIdAndTier(String destinationId, String tier);
}
