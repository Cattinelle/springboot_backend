package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.headway_clone.demo.model.User.ThemePreference;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this DTO for user's own profile data.
 * This includes private information that only the user can see.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {

    private UUID id;
    private String email;
    private String fullName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String avatarUrl;
    private String bio;
    private String country;
    private ThemePreference themePreference;
    private Boolean streakNotificationsEnabled;
    private Boolean dailyReminderEnabled;
    private Boolean newReleasesNotificationsEnabled;
    private LocalDateTime createdAt;
    private WeeklyGoalDto weeklyGoal;
}
