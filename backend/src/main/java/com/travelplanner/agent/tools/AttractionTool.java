package com.travelplanner.agent.tools;

import com.travelplanner.domain.model.Attraction;
import com.travelplanner.domain.repository.AttractionRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AttractionTool {

    private final AttractionRepository attractionRepository;

    public AttractionTool(AttractionRepository attractionRepository) {
        this.attractionRepository = attractionRepository;
    }

    public List<Map<String, Object>> getAttractions(String destinationId) {
        List<Attraction> list = destinationId != null ?
                attractionRepository.findByDestinationIdOrderByRatingDesc(destinationId) :
                attractionRepository.findAll();

        List<Map<String, Object>> results = new ArrayList<>();
        for (Attraction a : list) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("name", a.getName());
            item.put("category", a.getCategory());
            item.put("description", a.getDescription());
            item.put("rating", a.getRating());
            item.put("estimatedDurationMinutes", a.getEstimatedDurationMinutes());
            item.put("entryFeeUsd", a.getEntryFeeUsd());
            item.put("openingHours", a.getOpeningHours());
            item.put("recommendedTimeOfDay", a.getRecommendedTimeOfDay());
            item.put("latitude", a.getLatitude());
            item.put("longitude", a.getLongitude());
            results.add(item);
        }
        return results;
    }
}
