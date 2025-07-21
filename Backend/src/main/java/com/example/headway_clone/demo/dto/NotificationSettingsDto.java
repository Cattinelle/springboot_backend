package com.example.headway_clone.demo.dto;

public class NotificationSettingsDto {
    private boolean emailNotifications;
    private boolean pushNotifications;

    // Getters and Setters
    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }
} 