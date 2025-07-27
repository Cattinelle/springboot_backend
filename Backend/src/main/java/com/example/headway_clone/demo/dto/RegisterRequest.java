package com.example.headway_clone.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * We are creating this RegisterRequest DTO to handle user registration requests.
 * This DTO captures email, password, and full name for new user account creation.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
public class RegisterRequest {
    
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email; // User's email address for registration

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password; // User's password (minimum 6 characters)

    @NotBlank(message = "Full name is required")
    private String fullName; // User's full name for profile
}
