package com.travelplanner.domain.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "preferred_currency", length = 10)
    private String preferredCurrency = "USD";

    @Column(name = "travel_pace", length = 50)
    private String travelPace = "MODERATE";

    @Column(name = "accommodation_style", length = 50)
    private String accommodationStyle = "BOUTIQUE";

    @Column(name = "flight_preference", length = 50)
    private String flightPreference = "DIRECT_PREFERRED";

    @Column(columnDefinition = "TEXT")
    private String interests = "[\"culture\", \"food\", \"nature\"]";

    @Column(name = "budget_range", length = 50)
    private String budgetRange = "MEDIUM";

    @Column(name = "email_notifications_enabled")
    private boolean emailNotificationsEnabled = true;

    @Column(name = "sms_notifications_enabled")
    private boolean smsNotificationsEnabled = false;

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

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getPreferredCurrency() { return preferredCurrency; }
    public void setPreferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; }
    public String getTravelPace() { return travelPace; }
    public void setTravelPace(String travelPace) { this.travelPace = travelPace; }
    public String getAccommodationStyle() { return accommodationStyle; }
    public void setAccommodationStyle(String accommodationStyle) { this.accommodationStyle = accommodationStyle; }
    public String getFlightPreference() { return flightPreference; }
    public void setFlightPreference(String flightPreference) { this.flightPreference = flightPreference; }
    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }
    public boolean isEmailNotificationsEnabled() { return emailNotificationsEnabled; }
    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) { this.emailNotificationsEnabled = emailNotificationsEnabled; }
    public boolean isSmsNotificationsEnabled() { return smsNotificationsEnabled; }
    public void setSmsNotificationsEnabled(boolean smsNotificationsEnabled) { this.smsNotificationsEnabled = smsNotificationsEnabled; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
