package com.example.headway_clone.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * We are creating this VerifyOtpRequest DTO to handle OTP verification requests.
 * This DTO captures the email and 4-digit OTP code for password reset verification.
 */
@Data // Lombok annotation for getters, setters, equals, hashCode, and toString
public class VerifyOtpRequest {

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email; // Email address for which OTP was sent

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^\\d{4}$", message = "OTP must be exactly 4 digits")
    private String otp; // 4-digit OTP code entered by user
}
