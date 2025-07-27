package com.example.headway_clone.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * We are creating this ResetPasswordRequest DTO to handle password reset completion.
 * This DTO captures email, verified OTP, and new password for password reset.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
public class ResetPasswordRequest {

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email; // Email address for password reset

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^\\d{4}$", message = "OTP must be exactly 4 digits")
    private String otp; // Verified 4-digit OTP code

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword; // New password to set (minimum 6 characters)
}
