package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "itinerary_activities")
public class ItineraryActivity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_day_id", nullable = false)
    @JsonIgnore
    private ItineraryDay itineraryDay;

    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot; // MORNING, AFTERNOON, EVENING, NIGHT

    @Column(name = "start_time", length = 10)
    private String startTime;

    @Column(name = "end_time", length = 10)
    private String endTime;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_name", length = 200)
    private String locationName;

    private Double latitude;
    private Double longitude;

    @Column(name = "activity_type", length = 50)
    private String activityType = "ATTRACTION";

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost = BigDecimal.ZERO;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 90;

    @Column(name = "transport_mode_to_next", length = 50)
    private String transportModeToNext; // WALKING, METRO, TAXI, BUS

    @Column(name = "transport_duration_to_next_minutes")
    private Integer transportDurationToNextMinutes;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Column(name = "booking_reference", length = 100)
    private String bookingReference;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.createdAt == null) this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public ItineraryDay getItineraryDay() { return itineraryDay; }
    public void setItineraryDay(ItineraryDay itineraryDay) { this.itineraryDay = itineraryDay; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getTransportModeToNext() { return transportModeToNext; }
    public void setTransportModeToNext(String transportModeToNext) { this.transportModeToNext = transportModeToNext; }
    public Integer getTransportDurationToNextMinutes() { return transportDurationToNextMinutes; }
    public void setTransportDurationToNextMinutes(Integer transportDurationToNextMinutes) { this.transportDurationToNextMinutes = transportDurationToNextMinutes; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
