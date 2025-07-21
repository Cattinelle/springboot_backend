package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class UserBadge {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "badge_id")
    private Badge badge;

    private LocalDateTime earnedAt = LocalDateTime.now();

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
} 