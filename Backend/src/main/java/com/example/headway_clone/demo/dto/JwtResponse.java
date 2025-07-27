package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * We are creating this JwtResponse DTO to return authentication tokens and user info after successful login.
 * This DTO contains the JWT token and basic user information for the frontend.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
@AllArgsConstructor // Lombok annotation for constructor with all fields
@NoArgsConstructor // Lombok annotation for default constructor
public class JwtResponse {

    private String token; // JWT authentication token
    private String type = "Bearer"; // Token type (always "Bearer" for JWT)
    private UUID userId; // User's unique identifier
    private String email; // User's email address
    private String fullName; // User's full name
    private String avatarUrl; // User's avatar image URL (can be null)

    // Constructor without token type (type defaults to "Bearer")
    public JwtResponse(String token, UUID userId, String email, String fullName, String avatarUrl) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
    }
}
