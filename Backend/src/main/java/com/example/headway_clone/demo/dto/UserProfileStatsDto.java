package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * We are creating this UserProfileStatsDto to provide statistics for the user's profile page.
 * This includes actual lists of favorite and recommended books, plus simplified reading achievements.
 * Removed keyPointsRead as requested - only keeping essential metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileStatsDto {
    // List of books the user has marked as favorites (for sharing with others)
    private List<UserBookDto> favoriteBooks;

    // List of books the user is recommending to others
    private List<UserBookDto> recommendedBooks;

    // Total books completed (achievement metric for profile)
    private Integer totalBooksCompleted;

    // Current reading streak (simplified - just daily streak count)
    private Integer currentStreak;

    // Total reading time in minutes (profile achievement)
    private Integer totalReadingTimeMinutes;

    // Removed keyPointsRead field as requested
}
