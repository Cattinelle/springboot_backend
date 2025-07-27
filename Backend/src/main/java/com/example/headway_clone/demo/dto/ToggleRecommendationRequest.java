package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this ToggleRecommendationRequest DTO to handle recommendation operations.
 * Frontend sends this when user wants to add/remove books from their recommendations list.
 * This allows users to recommend books to others on their public profile.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToggleRecommendationRequest {
    // Book ID using Long to match Book entity's primary key type
    private Long bookId;

    // Boolean flag to set recommendation status (true = recommend, false = remove recommendation)
    private Boolean isRecommended;
}
