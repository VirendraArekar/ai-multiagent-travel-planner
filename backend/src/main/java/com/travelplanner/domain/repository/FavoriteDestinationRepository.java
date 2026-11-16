package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.FavoriteDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteDestinationRepository extends JpaRepository<FavoriteDestination, String> {
    List<FavoriteDestination> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<FavoriteDestination> findByUserIdAndDestinationId(String userId, String destinationId);
    boolean existsByUserIdAndDestinationId(String userId, String destinationId);
}
