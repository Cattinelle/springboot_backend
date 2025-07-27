package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this PasswordResetToken entity to handle OTP-based password reset functionality.
 * This entity stores 4-digit OTP codes that expire in 5 minutes for secure password reset.
 */
@Entity
@Table(name = "passwordResetToken")
@Data // Lombok annotation that generates getters, setters, equals, hashCode, and toString
@Builder // Lombok annotation for builder pattern
@NoArgsConstructor // Lombok annotation for default constructor
@AllArgsConstructor // Lombok annotation for constructor with all fields
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id; // Primary key for the token

    @Column(nullable = false)
    private String email; // Email address for which the OTP was generated

    @Column(nullable = false, length = 4)
    private String otp; // 4-digit OTP code (1000-9999)

    @Column(nullable = false)
    private LocalDateTime createdAt; // When the OTP was created

    @Column(nullable = false)
    private LocalDateTime expiresAt; // When the OTP expires (5 minutes from creation)

    @Column(nullable = false)
    private boolean used = false; // Whether the OTP has been used for password reset

    /**
     * Checks if the OTP token is still valid (not expired and not used)
     * @return true if the token is valid, false otherwise
     */
    public boolean isValid() {
        return !used && LocalDateTime.now().isBefore(expiresAt);
    }

    /**
     * Marks the token as used to prevent reuse
     */
    public void markAsUsed() {
        this.used = true;
    }
}
