package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.dto.PageResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.dto.trip.*;
import com.travelplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TripCreateRequest request) {
        TripResponse response = tripService.createTrip(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Trip created and planning started", response));
    }

    @PostMapping("/wizard")
    public ResponseEntity<ApiResponse<TripResponse>> wizardPlanTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody WizardTripRequest request) {
        TripResponse response = tripService.wizardPlanTrip(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Trip planned by AI agents", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TripSummaryDto>>> getUserTrips(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TripSummaryDto> trips = tripService.getUserTrips(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(trips)));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        String userId = principal != null ? principal.getId() : null;
        TripResponse response = tripService.getTripById(tripId, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId,
            @RequestBody TripUpdateRequest request) {
        TripResponse response = tripService.updateTrip(tripId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Trip updated successfully", response));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        tripService.deleteTrip(tripId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Trip deleted successfully", null));
    }

    @PostMapping("/{tripId}/duplicate")
    public ResponseEntity<ApiResponse<TripResponse>> duplicateTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        TripResponse response = tripService.duplicateTrip(tripId, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Trip duplicated successfully", response));
    }

    @GetMapping("/share/{shareToken}")
    public ResponseEntity<ApiResponse<TripResponse>> getSharedTrip(@PathVariable String shareToken) {
        TripResponse response = tripService.getPublicTripByShareToken(shareToken);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
