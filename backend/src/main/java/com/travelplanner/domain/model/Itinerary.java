package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "itineraries")
public class Itinerary {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    @JsonIgnore
    private Trip trip;

    private Integer version = 1;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "critic_score", precision = 3, scale = 1)
    private BigDecimal criticScore = BigDecimal.valueOf(9.0);

    @Column(name = "critic_feedback", columnDefinition = "TEXT")
    private String criticFeedback;

    @Column(name = "is_optimized")
    private boolean optimized = true;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("dayNumber ASC")
    private List<ItineraryDay> days = new ArrayList<>();

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
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public BigDecimal getCriticScore() { return criticScore; }
    public void setCriticScore(BigDecimal criticScore) { this.criticScore = criticScore; }
    public String getCriticFeedback() { return criticFeedback; }
    public void setCriticFeedback(String criticFeedback) { this.criticFeedback = criticFeedback; }
    public boolean isOptimized() { return optimized; }
    public void setOptimized(boolean optimized) { this.optimized = optimized; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<ItineraryDay> getDays() { return days; }
    public void setDays(List<ItineraryDay> days) { this.days = days; }
}
