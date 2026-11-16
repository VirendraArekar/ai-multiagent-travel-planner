package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String>, JpaSpecificationExecutor<Trip> {
    Page<Trip> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);
    List<Trip> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(String userId);
    Optional<Trip> findByIdAndUserIdAndDeletedFalse(String id, String userId);
    Optional<Trip> findByShareTokenAndDeletedFalse(String shareToken);
    long countByUserIdAndDeletedFalse(String userId);
}
