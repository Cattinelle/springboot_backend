package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * We are creating this DTO for public user profile display.
 * This shows what other users can see when viewing someone's profile.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPublicProfileDto {

    private UUID id;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String country;
    private LocalDateTime createdAt;
    private List<UserBookDto> favoriteBooks;
    private List<UserBookDto> recommendedBooks;
}
