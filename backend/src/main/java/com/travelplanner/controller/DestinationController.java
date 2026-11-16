package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.dto.PageResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.domain.model.Destination;
import com.travelplanner.domain.model.FavoriteDestination;
import com.travelplanner.service.DestinationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Destination>>> getAllDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Destination> destinations = destinationService.getAllDestinations(pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(destinations)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Destination>>> getFeaturedDestinations() {
        List<Destination> list = destinationService.getFeaturedDestinations();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Destination>>> getPopularDestinations() {
        List<Destination> list = destinationService.getPopularDestinations();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<Destination>>> searchDestinations(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Destination> results = destinationService.searchDestinations(query, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(results)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Destination>> getDestinationById(@PathVariable String id) {
        Destination dest = destinationService.getDestinationById(id);
        return ResponseEntity.ok(ApiResponse.ok(dest));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id) {
        destinationService.saveFavorite(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Destination saved to favorites", null));
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id) {
        destinationService.removeFavorite(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Destination removed from favorites", null));
    }

    @GetMapping("/user/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteDestination>>> getUserFavorites(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<FavoriteDestination> favs = destinationService.getUserFavorites(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(favs));
    }
}
