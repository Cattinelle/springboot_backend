package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this Milestone entity to track user reading achievements.
 * This includes daily streak tracking, total books completed, and total reading time.
 * The streak resets to 0 if the user doesn't complete at least one book in a day.
 */
@Entity
@Table(name = "milestone")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // User relationship - one user has one milestone
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Daily streak - resets to 0 if user doesn't complete a book for the day
    @Builder.Default
    private Integer dailyStreak = 0;

    // Total books completed by the user
    @Builder.Default
    private Integer booksCompleted = 0;

    // Total reading time in minutes across all books
    @Builder.Default
    private Integer totalReadingTimeMinutes = 0;

    // Last date when user completed a book (for streak calculation)
    private LocalDateTime lastCompletionDate;

    // Timestamp when milestone was created
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Timestamp when milestone was last updated
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
