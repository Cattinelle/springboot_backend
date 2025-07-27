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
public class UserBookDto {
    private UUID id;
    private UUID userId;
    private BookDto book;
    private String status; // READING, SAVED_FOR_LATER, COMPLETED, NOT_STARTED

    // Progress tracking - Updated currentKeyPointId to use Long
    private Long currentKeyPointId;
    private Integer completedKeyPoints;
    private Integer progressPercentage;

    // Relationship flags
    private Boolean isFavorite;
    private Boolean isRecommended;

    // Timestamps
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastReadAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
