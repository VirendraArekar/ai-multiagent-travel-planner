package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, String>, JpaSpecificationExecutor<Destination> {
    List<Destination> findByFeaturedTrue();
    List<Destination> findByPopularTrue();
    Optional<Destination> findByNameIgnoreCase(String name);

    @Query("SELECT d FROM Destination d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.country) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Destination> searchDestinations(String query, Pageable pageable);
}
