package com.travelplanner.service;

import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.domain.model.Hotel;
import com.travelplanner.domain.repository.HotelRepository;
import com.travelplanner.dto.discovery.HotelSearchCriteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<Hotel> searchHotels(HotelSearchCriteria criteria) {
        List<Hotel> all = hotelRepository.findAll();

        return all.stream()
                .filter(h -> {
                    if (criteria.destinationId() != null && StringUtils.hasText(criteria.destinationId())) {
                        if (!h.getDestination().getId().equalsIgnoreCase(criteria.destinationId())) return false;
                    }
                    if (criteria.tier() != null && StringUtils.hasText(criteria.tier())) {
                        if (!h.getTier().equalsIgnoreCase(criteria.tier())) return false;
                    }
                    if (criteria.minStars() != null && h.getStarRating() < criteria.minStars()) {
                        return false;
                    }
                    if (criteria.maxPricePerNight() != null && h.getPricePerNightUsd().compareTo(criteria.maxPricePerNight()) > 0) {
                        return false;
                    }
                    if (Boolean.TRUE.equals(criteria.familyFriendly()) && !h.isFamilyFriendly()) {
                        return false;
                    }
                    return true;
                })
                .sorted((h1, h2) -> {
                    if ("PRICE_ASC".equalsIgnoreCase(criteria.sortBy())) {
                        return h1.getPricePerNightUsd().compareTo(h2.getPricePerNightUsd());
                    } else if ("PRICE_DESC".equalsIgnoreCase(criteria.sortBy())) {
                        return h2.getPricePerNightUsd().compareTo(h1.getPricePerNightUsd());
                    }
                    // Default to RATING_DESC
                    return h2.getUserRating().compareTo(h1.getUserRating());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Hotel getHotelById(String id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }
}
