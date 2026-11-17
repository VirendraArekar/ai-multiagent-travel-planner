package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.dto.booking.BookingCreateRequest;
import com.travelplanner.dto.booking.BookingDto;
import com.travelplanner.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUserBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<BookingDto> list = bookingService.getUserBookings(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getTripBookings(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        List<BookingDto> list = bookingService.getTripBookings(tripId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingCreateRequest request) {
        BookingDto dto = bookingService.createBooking(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Booking saved", dto));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingDto>> updateBookingStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String bookingId,
            @RequestParam String status) {
        BookingDto dto = bookingService.updateBookingStatus(bookingId, status, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated", dto));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String bookingId) {
        bookingService.deleteBooking(bookingId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking removed", null));
    }
}
