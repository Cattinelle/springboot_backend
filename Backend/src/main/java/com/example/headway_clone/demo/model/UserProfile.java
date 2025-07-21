package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String avatarUrl;
    private String bio;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
} 