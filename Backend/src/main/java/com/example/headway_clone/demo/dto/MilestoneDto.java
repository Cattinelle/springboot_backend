package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneDto {
    private UUID id;
    private Integer dailyStreak;
    private Integer booksCompleted;
    private Integer totalReadingTimeMinutes;
    private Integer keyPointsRead;
    private LocalDateTime lastStreakDate;
    private Integer longestStreak;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
