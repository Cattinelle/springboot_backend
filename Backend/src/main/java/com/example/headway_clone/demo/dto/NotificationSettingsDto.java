package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this DTO to handle notification settings for users.
 * This includes streak notifications, daily reminders, and new release notifications.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettingsDto {

    private Boolean streakNotificationsEnabled;
    private Boolean dailyReminderEnabled;
    private Boolean newReleasesNotificationsEnabled;
}
