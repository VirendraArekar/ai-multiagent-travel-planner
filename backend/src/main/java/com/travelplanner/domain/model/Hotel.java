package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    @JsonIgnore
    private Destination destination;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "hotel_type", length = 50)
    private String hotelType = "HOTEL";

    @Column(length = 50)
    private String tier = "MID_RANGE";

    @Column(name = "star_rating")
    private Integer starRating = 4;

    @Column(name = "user_rating", precision = 3, scale = 2)
    private BigDecimal userRating = BigDecimal.valueOf(4.5);

    @Column(name = "price_per_night_usd", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNightUsd;

    @Column(length = 300)
    private String address;

    private Double latitude;
    private Double longitude;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String amenities = "[\"WiFi\", \"Air Conditioning\", \"Breakfast\"]";

    @Column(name = "family_friendly")
    private boolean familyFriendly = true;

    @Column(name = "cancellation_policy", length = 255)
    private String cancellationPolicy = "Free cancellation up to 48 hours before check-in";

    @Column(name = "booking_url", length = 500)
    private String bookingUrl;

    @Column(length = 50)
    private String provider = "AMADEUS";

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
    public String getHotelType() { return hotelType; }
    public void setHotelType(String hotelType) { this.hotelType = hotelType; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }
    public BigDecimal getUserRating() { return userRating; }
    public void setUserRating(BigDecimal userRating) { this.userRating = userRating; }
    public BigDecimal getPricePerNightUsd() { return pricePerNightUsd; }
    public void setPricePerNightUsd(BigDecimal pricePerNightUsd) { this.pricePerNightUsd = pricePerNightUsd; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
    public boolean isFamilyFriendly() { return familyFriendly; }
    public void setFamilyFriendly(boolean familyFriendly) { this.familyFriendly = familyFriendly; }
    public String getCancellationPolicy() { return cancellationPolicy; }
    public void setCancellationPolicy(String cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    public String getBookingUrl() { return bookingUrl; }
    public void setBookingUrl(String bookingUrl) { this.bookingUrl = bookingUrl; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
