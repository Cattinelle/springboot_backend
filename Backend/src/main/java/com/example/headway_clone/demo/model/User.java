package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * We are creating this User entity to represent users in our QuickTales application.
 * This entity handles user authentication, profile information, friendships, weekly reading goals,
 * and user preferences including theme and notification settings.
 */
@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    // Authentication fields
    @Email
    @NotBlank
    @Column(unique = true)
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String password;

    // Basic profile information
    @NotBlank
    @Column(name = "full_name")
    private String fullName;

    private LocalDate dateOfBirth;

    private String phoneNumber;

    // Profile information for public display
    private String avatarUrl;
    
    private String bio;

    private String country;

    // Account status and timestamps
    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Last login timestamp
    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // Weekly reading goals
    @Builder.Default
    private Integer weeklyGoalBooks = 0;

    @Builder.Default
    private Integer weeklyProgress = 0;

    private LocalDate weekStartDate;

    // User preferences
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ThemePreference themePreference = ThemePreference.LIGHT;

    // Notification settings
    @Builder.Default
    private Boolean streakNotificationsEnabled = true;

    @Builder.Default
    private Boolean dailyReminderEnabled = true;

    @Builder.Default
    private Boolean newReleasesNotificationsEnabled = true;

    // User books relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<UserBook> userBooks = new ArrayList<>();

    // Friend requests sent by this user
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FriendRequest> sentFriendRequests = new ArrayList<>();

    // Friend requests received by this user
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();

    // User milestone relationship
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Milestone milestone;

    // Theme preference enum
    public enum ThemePreference {
        LIGHT, DARK
    }

    // Helper methods for favorite and recommended books
    public List<UserBook> getFavoriteBooks() {
        return userBooks.stream()
                .filter(ub -> ub.getIsFavorite())
                .toList();
    }

    public List<UserBook> getRecommendedBooks() {
        return userBooks.stream()
                .filter(ub -> ub.getIsRecommended())
                .toList();
    }

    public List<UserBook> getCurrentlyReadingBooks() {
        return userBooks.stream()
                .filter(ub -> ub.getStatus() == UserBook.ReadingStatus.READING)
                .toList();
    }

    public List<UserBook> getCompletedBooks() {
        return userBooks.stream()
                .filter(ub -> ub.getStatus() == UserBook.ReadingStatus.COMPLETED)
                .toList();
    }

    public List<UserBook> getSavedForLaterBooks() {
        return userBooks.stream()
                .filter(ub -> ub.getStatus() == UserBook.ReadingStatus.SAVED_FOR_LATER)
                .toList();
    }

    // Helper method to increment weekly progress when a book is completed
    public void incrementWeeklyProgress() {
        this.weeklyProgress = this.weeklyProgress + 1;
    }

    // Helper method to check and reset weekly progress
    public void checkAndResetWeeklyProgress() {
        if (weekStartDate != null && weekStartDate.plusDays(7).isBefore(LocalDate.now())) {
            this.weeklyProgress = 0;
            this.weekStartDate = LocalDate.now();
        }
    }

    // Helper method to calculate weekly progress percentage
    public Integer getWeeklyProgressPercentage() {
        if (weeklyGoalBooks == 0) return 0;
        return Math.min(100, (weeklyProgress * 100) / weeklyGoalBooks);
    }
}