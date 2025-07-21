package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Email
    @NotBlank
    @Column(unique = true)
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String password;
    
    private String firstName;
    private String lastName;
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    private SubscriptionType subscriptionType = SubscriptionType.FREE;
    
    private LocalDateTime subscriptionStartDate;
    private LocalDateTime subscriptionEndDate;
    private Integer dailyGoalMinutes = 15;
    private String preferredLanguage = "en";
    private String timezone = "UTC";
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime lastLoginAt;
    private Boolean isActive = true;
    
    private String country;
    private String phoneNumber;
    private String bio;
    private LocalDateTime dateOfBirth;
    
    // Constructors
    public User() {}
    
    public User(String email, String password, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public SubscriptionType getSubscriptionType() { return subscriptionType; }
    public void setSubscriptionType(SubscriptionType subscriptionType) { this.subscriptionType = subscriptionType; }
    
    public LocalDateTime getSubscriptionStartDate() { return subscriptionStartDate; }
    public void setSubscriptionStartDate(LocalDateTime subscriptionStartDate) { this.subscriptionStartDate = subscriptionStartDate; }
    
    public LocalDateTime getSubscriptionEndDate() { return subscriptionEndDate; }
    public void setSubscriptionEndDate(LocalDateTime subscriptionEndDate) { this.subscriptionEndDate = subscriptionEndDate; }
    
    public Integer getDailyGoalMinutes() { return dailyGoalMinutes; }
    public void setDailyGoalMinutes(Integer dailyGoalMinutes) { this.dailyGoalMinutes = dailyGoalMinutes; }
    
    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public LocalDateTime getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDateTime dateOfBirth) { this.dateOfBirth = dateOfBirth; }
}