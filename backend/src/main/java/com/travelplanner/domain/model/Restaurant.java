package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    @JsonIgnore
    private Destination destination;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "cuisine_type", nullable = false, length = 100)
    private String cuisineType;

    @Column(name = "price_level", length = 10)
    private String priceLevel = "$$";

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "review_count")
    private Integer reviewCount = 150;

    @Column(length = 300)
    private String address;

    private Double latitude;
    private Double longitude;

    @Column(name = "famous_dishes", columnDefinition = "TEXT")
    private String famousDishes;

    @Column(name = "has_vegetarian_options")
    private boolean hasVegetarianOptions = true;

    @Column(name = "has_vegan_options")
    private boolean hasVeganOptions = false;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "reservation_url", length = 500)
    private String reservationUrl;

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
    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }
    public String getPriceLevel() { return priceLevel; }
    public void setPriceLevel(String priceLevel) { this.priceLevel = priceLevel; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getFamousDishes() { return famousDishes; }
    public void setFamousDishes(String famousDishes) { this.famousDishes = famousDishes; }
    public boolean isHasVegetarianOptions() { return hasVegetarianOptions; }
    public void setHasVegetarianOptions(boolean hasVegetarianOptions) { this.hasVegetarianOptions = hasVegetarianOptions; }
    public boolean isHasVeganOptions() { return hasVeganOptions; }
    public void setHasVeganOptions(boolean hasVeganOptions) { this.hasVeganOptions = hasVeganOptions; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getReservationUrl() { return reservationUrl; }
    public void setReservationUrl(String reservationUrl) { this.reservationUrl = reservationUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
