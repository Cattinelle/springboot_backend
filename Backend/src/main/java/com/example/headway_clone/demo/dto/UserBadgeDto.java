package com.example.headway_clone.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserBadgeDto {
    private UUID id;
    private UUID userId;
    private UUID badgeId;
    private LocalDateTime earnedAt;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getBadgeId() { return badgeId; }
    public void setBadgeId(UUID badgeId) { this.badgeId = badgeId; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
} 