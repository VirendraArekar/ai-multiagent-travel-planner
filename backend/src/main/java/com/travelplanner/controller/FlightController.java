package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.domain.model.Flight;
import com.travelplanner.dto.discovery.FlightSearchCriteria;
import com.travelplanner.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlights(
            @RequestParam(required = false) String originAirport,
            @RequestParam(required = false) String destinationAirport,
            @RequestParam(required = false) LocalDate departureDate,
            @RequestParam(required = false) LocalDate returnDate,
            @RequestParam(required = false) Integer passengers,
            @RequestParam(required = false) String cabinClass,
            @RequestParam(required = false) Boolean directOnly,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String preferredAirline,
            @RequestParam(defaultValue = "PRICE_ASC") String sortBy) {

        FlightSearchCriteria criteria = new FlightSearchCriteria(
                originAirport,
                destinationAirport,
                departureDate,
                returnDate,
                passengers,
                cabinClass,
                directOnly,
                maxPrice,
                preferredAirline,
                sortBy
        );

        List<Flight> flights = flightService.searchFlights(criteria);
        return ResponseEntity.ok(ApiResponse.ok(flights));
    }
}
