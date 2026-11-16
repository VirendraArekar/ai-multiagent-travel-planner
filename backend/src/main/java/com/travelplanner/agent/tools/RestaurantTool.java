package com.travelplanner.agent.tools;

import com.travelplanner.domain.model.Restaurant;
import com.travelplanner.domain.repository.RestaurantRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class RestaurantTool {

    private final RestaurantRepository restaurantRepository;

    public RestaurantTool(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public List<Map<String, Object>> getRestaurants(String destinationId, boolean vegetarianOnly) {
        List<Restaurant> list;
        if (destinationId != null) {
            list = vegetarianOnly ?
                    restaurantRepository.findByDestinationIdAndHasVegetarianOptionsTrue(destinationId) :
                    restaurantRepository.findByDestinationId(destinationId);
        } else {
            list = restaurantRepository.findAll();
        }

        List<Map<String, Object>> results = new ArrayList<>();
        for (Restaurant r : list) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", r.getId());
            item.put("name", r.getName());
            item.put("cuisineType", r.getCuisineType());
            item.put("priceLevel", r.getPriceLevel());
            item.put("rating", r.getRating());
            item.put("famousDishes", r.getFamousDishes());
            item.put("hasVegetarian", r.isHasVegetarianOptions());
            item.put("hasVegan", r.isHasVeganOptions());
            item.put("address", r.getAddress());
            item.put("latitude", r.getLatitude());
            item.put("longitude", r.getLongitude());
            results.add(item);
        }
        return results;
    }
}
