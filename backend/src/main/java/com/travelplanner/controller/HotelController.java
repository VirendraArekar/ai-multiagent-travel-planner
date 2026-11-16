package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.domain.model.Hotel;
import com.travelplanner.dto.discovery.HotelSearchCriteria;
import com.travelplanner.service.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hotel>>> searchHotels(
            @RequestParam(required = false) String destinationId,
            @RequestParam(required = false) String destinationName,
            @RequestParam(required = false) LocalDate checkInDate,
            @RequestParam(required = false) LocalDate checkOutDate,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) Integer rooms,
            @RequestParam(required = false) String tier,
            @RequestParam(required = false) Integer minStars,
            @RequestParam(required = false) BigDecimal maxPricePerNight,
            @RequestParam(required = false) Boolean familyFriendly,
            @RequestParam(defaultValue = "RATING_DESC") String sortBy) {

        HotelSearchCriteria criteria = new HotelSearchCriteria(
                destinationId,
                destinationName,
                checkInDate,
                checkOutDate,
                guests,
                rooms,
                tier,
                minStars,
                maxPricePerNight,
                familyFriendly,
                sortBy
        );

        List<Hotel> hotels = hotelService.searchHotels(criteria);
        return ResponseEntity.ok(ApiResponse.ok(hotels));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hotel>> getHotelById(@PathVariable String id) {
        Hotel hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.ok(hotel));
    }
}
