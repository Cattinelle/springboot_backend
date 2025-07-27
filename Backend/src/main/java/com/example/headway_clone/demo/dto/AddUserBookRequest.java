package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this AddUserBookRequest DTO to handle adding books to user's library.
 * Updated to use Long bookId to match the Book entity's primary key type.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddUserBookRequest {
    // Book ID using Long to match Book entity's primary key
    private Long bookId;

    // Reading status when adding the book (READING, SAVED_FOR_LATER, NOT_STARTED)
    private String status;

    // Whether to mark as favorite when adding
    private Boolean isFavorite = false;

    // Whether this is a recommended book
    private Boolean isRecommended = false;
}
