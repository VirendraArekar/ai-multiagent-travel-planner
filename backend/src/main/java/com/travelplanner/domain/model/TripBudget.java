package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trip_budgets")
public class TripBudget {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    @JsonIgnore
    private Trip trip;

    @Column(name = "total_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalBudget;

    @Column(name = "flights_allocated", precision = 12, scale = 2)
    private BigDecimal flightsAllocated = BigDecimal.ZERO;

    @Column(name = "hotels_allocated", precision = 12, scale = 2)
    private BigDecimal hotelsAllocated = BigDecimal.ZERO;

    @Column(name = "transport_allocated", precision = 12, scale = 2)
    private BigDecimal transportAllocated = BigDecimal.ZERO;

    @Column(name = "food_allocated", precision = 12, scale = 2)
    private BigDecimal foodAllocated = BigDecimal.ZERO;

    @Column(name = "activities_allocated", precision = 12, scale = 2)
    private BigDecimal activitiesAllocated = BigDecimal.ZERO;

    @Column(name = "emergency_allocated", precision = 12, scale = 2)
    private BigDecimal emergencyAllocated = BigDecimal.ZERO;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.createdAt == null) this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public BigDecimal getTotalBudget() { return totalBudget; }
    public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }
    public BigDecimal getFlightsAllocated() { return flightsAllocated; }
    public void setFlightsAllocated(BigDecimal flightsAllocated) { this.flightsAllocated = flightsAllocated; }
    public BigDecimal getHotelsAllocated() { return hotelsAllocated; }
    public void setHotelsAllocated(BigDecimal hotelsAllocated) { this.hotelsAllocated = hotelsAllocated; }
    public BigDecimal getTransportAllocated() { return transportAllocated; }
    public void setTransportAllocated(BigDecimal transportAllocated) { this.transportAllocated = transportAllocated; }
    public BigDecimal getFoodAllocated() { return foodAllocated; }
    public void setFoodAllocated(BigDecimal foodAllocated) { this.foodAllocated = foodAllocated; }
    public BigDecimal getActivitiesAllocated() { return activitiesAllocated; }
    public void setActivitiesAllocated(BigDecimal activitiesAllocated) { this.activitiesAllocated = activitiesAllocated; }
    public BigDecimal getEmergencyAllocated() { return emergencyAllocated; }
    public void setEmergencyAllocated(BigDecimal emergencyAllocated) { this.emergencyAllocated = emergencyAllocated; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
