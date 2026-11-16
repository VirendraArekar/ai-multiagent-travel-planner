package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    List<Restaurant> findByDestinationId(String destinationId);
    List<Restaurant> findByDestinationIdAndHasVegetarianOptionsTrue(String destinationId);
}
