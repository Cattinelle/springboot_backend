package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * We are creating this UpdateUserProfileRequest DTO to handle profile update requests from the frontend.
 * This contains all the fields that users can update in their profile settings page.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequest {
    // Personal information updates
    private String fullName;
    private LocalDate dateOfBirth;
    private String phoneNumber;

    // Profile display updates
    private String avatarUrl;
    private String bio;
    private String country;
}
