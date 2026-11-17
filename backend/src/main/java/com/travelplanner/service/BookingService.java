package com.travelplanner.service;

import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.common.exception.UnauthorizedException;
import com.travelplanner.domain.model.Booking;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.BookingRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.booking.BookingCreateRequest;
import com.travelplanner.dto.booking.BookingDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            TripRepository tripRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getTripBookings(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getUser().getId().equals(userId) && !trip.isPublic()) {
            throw new UnauthorizedException("Unauthorized access to trip bookings");
        }

        return bookingRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto createBooking(String userId, BookingCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = null;
        if (request.tripId() != null) {
            trip = tripRepository.findById(request.tripId()).orElse(null);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrip(trip);
        booking.setBookingType(request.bookingType());
        booking.setProvider(request.provider());
        booking.setBookingReference(request.bookingReference());
        booking.setStatus(request.status() != null ? request.status() : "CONFIRMED");
        booking.setItemTitle(request.itemTitle());
        booking.setStartDatetime(request.startDatetime());
        booking.setEndDatetime(request.endDatetime());
        booking.setTotalPrice(request.totalPrice());
        booking.setCurrency(request.currency() != null ? request.currency() : "USD");
        booking.setCancellationPolicy(request.cancellationPolicy());
        booking.setProviderLink(request.providerLink());
        booking.setNotes(request.notes());

        booking = bookingRepository.save(booking);
        return mapToDto(booking);
    }

    @Transactional
    public BookingDto updateBookingStatus(String bookingId, String status, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this booking");
        }

        booking.setStatus(status);
        booking = bookingRepository.save(booking);
        return mapToDto(booking);
    }

    @Transactional
    public void deleteBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this booking");
        }
        bookingRepository.delete(booking);
    }

    private BookingDto mapToDto(Booking b) {
        return new BookingDto(
                b.getId(),
                b.getTrip() != null ? b.getTrip().getId() : null,
                b.getUser().getId(),
                b.getBookingType(),
                b.getProvider(),
                b.getBookingReference(),
                b.getStatus(),
                b.getItemTitle(),
                b.getStartDatetime(),
                b.getEndDatetime(),
                b.getTotalPrice(),
                b.getCurrency(),
                b.getCancellationPolicy(),
                b.getProviderLink(),
                b.getNotes(),
                b.getCreatedAt()
        );
    }
}
