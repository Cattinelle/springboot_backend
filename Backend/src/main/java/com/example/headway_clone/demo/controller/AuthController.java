package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * We are creating this AuthController to handle all authentication-related HTTP requests.
 * This controller provides endpoints for user registration, login, and OTP-based password reset.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/login - Authenticates user and returns JWT token
     * @param loginRequest Contains user email and password
     * @return JWT token and user information on successful authentication
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.login(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register - Registers a new user account
     * @param registerRequest Contains email, password, and full name
     * @return Success message on successful registration
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/forgot-password - Sends OTP to user's email for password reset
     * @param request Contains email address for password reset
     * @return Success message when OTP is sent
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String message = authService.sendOtp(request);
            return ResponseEntity.ok(new ApiResponse(true, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-otp - Verifies the OTP sent to user's email
     * @param request Contains email and OTP for verification
     * @return Success message if OTP is valid
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            String message = authService.verifyOtp(request);
            return ResponseEntity.ok(new ApiResponse(true, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * POST /api/auth/reset-password - Resets user password after OTP verification
     * @param request Contains email, verified OTP, and new password
     * @return Success message when password is reset
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            String message = authService.resetPassword(request);
            return ResponseEntity.ok(new ApiResponse(true, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * GET /api/auth/test - Test endpoint to check if auth controller is working
     * @return Simple test message
     */
    @GetMapping("/test")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(new ApiResponse(true, "Auth controller is working!"));
    }
}
