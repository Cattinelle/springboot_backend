package com.example.headway_clone.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * We are creating this ForgotPasswordRequest DTO to handle password reset requests.
 * This DTO captures the email address for sending OTP codes.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
public class ForgotPasswordRequest {

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email; // Email address to send OTP for password reset
}
