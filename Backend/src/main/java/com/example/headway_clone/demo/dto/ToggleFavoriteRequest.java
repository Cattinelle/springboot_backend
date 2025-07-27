package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this ToggleFavoriteRequest DTO to handle favorite/unfavorite operations.
 * Updated to use Long bookId to match the Book entity's primary key type.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToggleFavoriteRequest {
    // Book ID using Long to match Book entity's primary key type
    private Long bookId;

    // Boolean flag to set favorite status (true = favorite, false = unfavorite)
    private Boolean isFavorite;
}
