package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.model.PasswordResetToken;
import com.example.headway_clone.demo.model.Milestone;
import com.example.headway_clone.demo.repository.UserRepository;
import com.example.headway_clone.demo.repository.PasswordResetTokenRepository;
import com.example.headway_clone.demo.repository.MilestoneRepository;
import com.example.headway_clone.demo.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

/**
 * We are creating this AuthService to handle authentication and OTP-based password reset.
 * This service manages login, registration, OTP generation/verification, and secure password reset.
 */
@Service
@RequiredArgsConstructor // Lombok annotation for constructor injection
public class AuthService {
    
    // Constructor injection using Lombok @RequiredArgsConstructor
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final MilestoneRepository milestoneRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    /**
     * Authenticates user with email and password, returns JWT token on success
     * @param loginRequest Contains email and password for authentication
     * @return JwtResponse with token and user information
     */
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        // Authenticate user credentials
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        // Set authentication context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user from database
        User user = getUserByEmail(loginRequest.getEmail());
        
        // Generate JWT token with user email and ID
        String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail(), user.getId());

        // Update last login time in database
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Return JWT response with user information
        return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getAvatarUrl());
    }
    
    /**
     * Registers a new user account with default settings and creates initial milestone
     * @param registerRequest Contains email, password, and full name for registration
     * @return Created User entity
     */
    @Transactional
    public User register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create new user with default settings
        User user = User.builder()
            .email(registerRequest.getEmail())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .fullName(registerRequest.getFullName())
            .createdAt(LocalDateTime.now()) // Use createdAt instead of accountCreatedAt
            .isActive(true) // Set user as active by default
            .themePreference(User.ThemePreference.LIGHT) // Default to light theme
            .streakNotificationsEnabled(true) // Enable streak notifications by default
            .dailyReminderEnabled(true) // Enable daily reminders by default
            .newReleasesNotificationsEnabled(true) // Enable new release notifications by default
            .weeklyGoalBooks(0)
            .weeklyProgress(0)
            .weekStartDate(LocalDate.now())
            .sentFriendRequests(new ArrayList<>())
            .receivedFriendRequests(new ArrayList<>())
            .userBooks(new ArrayList<>())
            .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Create initial milestone for the user
        Milestone milestone = Milestone.builder()
            .user(savedUser)
            .dailyStreak(0)
            .booksCompleted(0)
            .totalReadingTimeMinutes(0)
            .build();

        milestoneRepository.save(milestone);

        return savedUser;
    }
    
    /**
     * Step 1 of password reset: Generate and send 4-digit OTP to user's email
     * @param request Contains email address for password reset
     * @return Success message
     */
    @Transactional
    public String sendOtp(ForgotPasswordRequest request) {
        String email = request.getEmail();

        // Check if email exists in our system
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("No account found with this email address");
        }

        // Generate 4-digit OTP (1000-9999)
        String otp = generateOtp();

        // Calculate expiry time (5 minutes from now)
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        // Delete any existing tokens for this email to prevent multiple active OTPs
        passwordResetTokenRepository.deleteByEmail(email);

        // Create and save new OTP token
        PasswordResetToken token = PasswordResetToken.builder()
            .email(email)
            .otp(otp)
            .createdAt(LocalDateTime.now())
            .expiresAt(expiresAt)
            .used(false)
            .build();

        passwordResetTokenRepository.save(token);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully to your email address";
    }

    /**
     * Step 2 of password reset: Verify the OTP code sent to user's email
     * @param request Contains email and OTP for verification
     * @return Success message if OTP is valid
     */
    public String verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        // Find the most recent valid token for this email
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository
            .findTopByEmailOrderByCreatedAtDesc(email);

        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("No OTP found for this email");
        }

        PasswordResetToken token = tokenOpt.get();

        // Verify OTP and check if it's still valid
        if (!token.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (!token.isValid()) {
            throw new RuntimeException("OTP has expired or already been used");
        }

        return "OTP verified successfully";
    }

    /**
     * Step 3 of password reset: Reset password after OTP verification
     * @param request Contains email, OTP, and new password
     * @return Success message
     */
    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        // Find and verify the OTP token
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository
            .findTopByEmailOrderByCreatedAtDesc(email);

        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("No OTP found for this email");
        }

        PasswordResetToken token = tokenOpt.get();

        // Verify OTP and check validity
        if (!token.getOtp().equals(otp) || !token.isValid()) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Get user and update password
        User user = getUserByEmail(email);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used to prevent reuse
        token.markAsUsed();
        passwordResetTokenRepository.save(token);

        return "Password reset successfully";
    }

    /**
     * Helper method to generate a 4-digit OTP
     * @return Random 4-digit OTP as string
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000); // Generates number between 1000-9999
        return String.valueOf(otp);
    }

    /**
     * Helper method to get user by email, throws exception if not found
     * @param email User's email address
     * @return User entity
     */
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
