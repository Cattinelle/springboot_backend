package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * We are creating this UserLibraryStatsDto to provide reading statistics for the user's library.
 * This DTO contains actual lists of books for different reading statuses in the user's library.
 * The frontend can calculate counts using .length on these arrays.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLibraryStatsDto {
    // List of books currently being read
    private List<UserBookDto> currentlyReading;

    // List of books saved for later reading
    private List<UserBookDto> savedForLater;

    // List of books the user has completed reading
    private List<UserBookDto> completedBooks;
}
