package com.example.headway_clone.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * We are creating this LoginRequest DTO to handle user login requests.
 * This DTO captures email and password for user authentication.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
public class LoginRequest {
    
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email; // User's email address for login

    @NotBlank(message = "Password is required")
    private String password; // User's password for authentication
}