package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * We are creating this BookDto to represent book data for the frontend.
 * Updated to include all fields needed by the UserBook service.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String category;
    private String cover;
    private String overview;
    private String aboutAuthor;
    private String status; // NEW_RELEASE, POPULAR, CLASSIC, FEATURED
    private List<KeyPointDto> keyPoints;

    // User-specific fields (populated when user context is available)
    private String readingStatus; // READING, SAVED_FOR_LATER, COMPLETED
    private Integer progressPercentage;
    private Boolean isFavorite;
    private LocalDateTime lastReadAt;
}
