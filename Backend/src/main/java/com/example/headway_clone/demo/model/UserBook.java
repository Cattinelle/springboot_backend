package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this UserBook entity to manage all user-book relationships.
 * This includes reading progress, favorites, recommendations, and library management.
 * Each UserBook represents one user's interaction with one specific book.
 */
@Entity
@Table(name = "user_books", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "bookId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBook {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // User who owns this book relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    // Book that is part of this relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookId", nullable = false)
    private Book book;

    // Reading status for library organization
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReadingStatus status = ReadingStatus.NOT_STARTED;

    // Progress tracking fields - Updated to use Long for KeyPoint ID
    @Column(name = "current_keypoint_id")
    private Long currentKeyPointId;

    @Builder.Default
    private Integer completedKeyPoints = 0;

    @Builder.Default
    private Integer progressPercentage = 0;

    // Favorite and recommendation flags for profile display
    @Builder.Default
    private Boolean isFavorite = false;

    @Builder.Default
    private Boolean isRecommended = false;

    // Timestamp tracking for user activity
    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Reading status enum for library organization
    public enum ReadingStatus {
        NOT_STARTED,     // Added to library but not started reading
        READING,         // Currently reading
        COMPLETED,       // Finished reading
        SAVED_FOR_LATER  // Saved to read later
    }

    // Update timestamps on entity changes
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to start reading a book
    public void startReading() {
        if (this.status == ReadingStatus.NOT_STARTED || this.status == ReadingStatus.SAVED_FOR_LATER) {
            this.status = ReadingStatus.READING;
            this.startedAt = LocalDateTime.now();
        }
        this.lastReadAt = LocalDateTime.now();
    }

    // Helper method to complete a book
    public void completeBook() {
        this.status = ReadingStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.progressPercentage = 100;
    }

    // Helper method to update last read time
    public void updateLastRead() {
        this.lastReadAt = LocalDateTime.now();
    }
}
