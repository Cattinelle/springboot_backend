package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * We are creating this KeyPoint entity to represent individual key points/chapters within books.
 * This entity stores content, sequence, and estimated reading time but excludes audio features
 * and display order as requested. The estimatedReadTimeMinutes helps calculate total reading time
 * when users open/close keypoints.
 */
@Entity
@Table(name = "key_point")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship to parent book
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Key point content
    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String summary; // Changed from 'content' to 'summary' since keypoints contain long summaries

    // Additional insights for this key point
    @ElementCollection
    @CollectionTable(name = "key_point_insights", joinColumns = @JoinColumn(name = "key_point_id"))
    @Column(name = "insight")
    private List<String> insights;

    // Estimated read time for this key point - used for reading time calculation
    // Timer starts when user opens any keypoint, stops when user closes keypoint page
    @Column(name = "estimated_read_time_minutes")
    private Integer estimatedReadTimeMinutes;

    // Timestamps
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
