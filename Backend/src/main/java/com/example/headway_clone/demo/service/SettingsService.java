package com.example.headway_clone.demo.service;

import org.springframework.stereotype.Service;
import com.example.headway_clone.demo.dto.NotificationSettingsDto;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * We are creating this SettingsService to handle user preferences including theme and notifications.
 * This service manages the three notification types and light/dark theme preferences embedded in User entity.
 */
@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserRepository userRepository;

    public String getPrivacyPolicy() {
        // In a real app, load from DB or file
        return "This is the QuickTales privacy policy.";
    }

    public String getTerms() {
        // In a real app, load from DB or file
        return "These are the QuickTales terms and conditions.";
    }

    public String getHelp() {
        // In a real app, load from DB or file
        return "Help and support information for QuickTales.";
    }

    /**
     * Get user's notification preferences from User entity
     * Returns the three notification types: streak, daily reminder, and new releases
     */
    public NotificationSettingsDto getNotificationSettings(User user) {
        return NotificationSettingsDto.builder()
            .streakNotificationsEnabled(user.getStreakNotificationsEnabled())
            .dailyReminderEnabled(user.getDailyReminderEnabled())
            .newReleasesNotificationsEnabled(user.getNewReleasesNotificationsEnabled())
            .build();
    }

    /**
     * Update user's notification preferences in User entity
     * Updates the three notification types directly in the user record
     */
    public void updateNotificationSettings(User user, NotificationSettingsDto dto) {
        user.setStreakNotificationsEnabled(dto.getStreakNotificationsEnabled());
        user.setDailyReminderEnabled(dto.getDailyReminderEnabled());
        user.setNewReleasesNotificationsEnabled(dto.getNewReleasesNotificationsEnabled());
        userRepository.save(user);
    }

    /**
     * Get user's theme preference (LIGHT or DARK)
     */
    public User.ThemePreference getThemePreference(User user) {
        return user.getThemePreference();
    }

    /**
     * Update user's theme preference (LIGHT or DARK)
     * Default is LIGHT mode until user changes to DARK
     */
    public void updateThemePreference(User user, User.ThemePreference themePreference) {
        user.setThemePreference(themePreference);
        userRepository.save(user);
    }
}
