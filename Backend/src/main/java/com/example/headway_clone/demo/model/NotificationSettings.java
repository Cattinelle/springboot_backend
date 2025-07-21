package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean emailNotifications = true;
    private boolean pushNotifications = true;

    // Constructors
    public NotificationSettings() {}
    public NotificationSettings(User user) {
        this.user = user;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }
} 