package com.travelplanner.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String city;

    @Column(name = "iata_code", length = 10)
    private String iataCode;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "hero_image_url", length = 500)
    private String heroImageUrl;

    @Column(name = "average_daily_budget_usd", precision = 10, scale = 2)
    private BigDecimal averageDailyBudgetUsd = BigDecimal.valueOf(120.00);

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "best_time_to_visit", length = 255)
    private String bestTimeToVisit;

    @Column(name = "safety_rating", length = 50)
    private String safetyRating = "VERY_SAFE";

    private boolean popular = false;
    private boolean featured = false;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attraction> attractions = new ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Hotel> hotels = new ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Restaurant> restaurants = new ArrayList<>();

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
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getIataCode() { return iataCode; }
    public void setIataCode(String iataCode) { this.iataCode = iataCode; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }
    public BigDecimal getAverageDailyBudgetUsd() { return averageDailyBudgetUsd; }
    public void setAverageDailyBudgetUsd(BigDecimal averageDailyBudgetUsd) { this.averageDailyBudgetUsd = averageDailyBudgetUsd; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getBestTimeToVisit() { return bestTimeToVisit; }
    public void setBestTimeToVisit(String bestTimeToVisit) { this.bestTimeToVisit = bestTimeToVisit; }
    public String getSafetyRating() { return safetyRating; }
    public void setSafetyRating(String safetyRating) { this.safetyRating = safetyRating; }
    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<Attraction> getAttractions() { return attractions; }
    public void setAttractions(List<Attraction> attractions) { this.attractions = attractions; }
    public List<Hotel> getHotels() { return hotels; }
    public void setHotels(List<Hotel> hotels) { this.hotels = hotels; }
    public List<Restaurant> getRestaurants() { return restaurants; }
    public void setRestaurants(List<Restaurant> restaurants) { this.restaurants = restaurants; }
}
