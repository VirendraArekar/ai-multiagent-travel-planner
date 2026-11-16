package com.travelplanner.service;

import com.travelplanner.domain.model.Flight;
import com.travelplanner.domain.repository.FlightRepository;
import com.travelplanner.dto.discovery.FlightSearchCriteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Transactional(readOnly = true)
    public List<Flight> searchFlights(FlightSearchCriteria criteria) {
        List<Flight> all = flightRepository.findAll();

        return all.stream()
                .filter(f -> {
                    if (criteria.originAirport() != null && StringUtils.hasText(criteria.originAirport())) {
                        if (!f.getDepartureAirport().equalsIgnoreCase(criteria.originAirport())) return false;
                    }
                    if (criteria.destinationAirport() != null && StringUtils.hasText(criteria.destinationAirport())) {
                        if (!f.getArrivalAirport().equalsIgnoreCase(criteria.destinationAirport())) return false;
                    }
                    if (Boolean.TRUE.equals(criteria.directOnly()) && !f.isDirect()) {
                        return false;
                    }
                    if (criteria.maxPrice() != null && f.getPriceUsd().compareTo(criteria.maxPrice()) > 0) {
                        return false;
                    }
                    if (criteria.preferredAirline() != null && StringUtils.hasText(criteria.preferredAirline())) {
                        if (!f.getAirline().toLowerCase().contains(criteria.preferredAirline().toLowerCase())) return false;
                    }
                    return true;
                })
                .sorted((f1, f2) -> {
                    if ("DURATION_ASC".equalsIgnoreCase(criteria.sortBy())) {
                        return Integer.compare(f1.getDurationMinutes(), f2.getDurationMinutes());
                    }
                    // Default to PRICE_ASC
                    return f1.getPriceUsd().compareTo(f2.getPriceUsd());
                })
                .collect(Collectors.toList());
    }
}
