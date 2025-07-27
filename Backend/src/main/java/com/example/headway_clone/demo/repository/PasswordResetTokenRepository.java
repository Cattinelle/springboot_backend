package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * We are creating this PasswordResetTokenRepository to handle database operations for OTP tokens.
 * This repository manages CRUD operations for password reset tokens used in OTP-based authentication.
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    /**
     * Find the most recent password reset token for a given email
     * @param email User's email address
     * @return Optional containing the most recent token for the email
     */
    Optional<PasswordResetToken> findTopByEmailOrderByCreatedAtDesc(String email);

    /**
     * Delete all password reset tokens for a specific email
     * This is used to clean up old tokens before creating a new one
     * @param email User's email address
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken p WHERE p.email = :email")
    void deleteByEmail(@Param("email") String email);

    /**
     * Find a valid (unused and not expired) token by email and OTP
     * @param email User's email address
     * @param otp The OTP code to verify
     * @return Optional containing the token if found and valid
     */
    @Query("SELECT p FROM PasswordResetToken p WHERE p.email = :email AND p.otp = :otp AND p.used = false AND p.expiresAt > CURRENT_TIMESTAMP")
    Optional<PasswordResetToken> findValidTokenByEmailAndOtp(@Param("email") String email, @Param("otp") String otp);

    /**
     * Delete all expired tokens to keep the database clean
     * This method should be called periodically to remove old tokens
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiresAt < CURRENT_TIMESTAMP OR p.used = true")
    void deleteExpiredTokens();
}
