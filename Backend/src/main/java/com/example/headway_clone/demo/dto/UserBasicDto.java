package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * We are creating this DTO for basic user information.
 * This is used for displaying user info in lists, friend requests, etc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBasicDto {

    private UUID id;
    private String fullName;
    private String avatarUrl;
    private String country;
}
