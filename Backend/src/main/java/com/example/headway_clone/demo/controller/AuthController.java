package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.ApiResponse;
import com.example.headway_clone.demo.dto.JwtResponse;
import com.example.headway_clone.demo.dto.LoginRequest;
import com.example.headway_clone.demo.dto.RegisterRequest;
import com.example.headway_clone.demo.dto.ForgotPasswordRequest;
import com.example.headway_clone.demo.dto.ResetPasswordRequest;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid email or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // In a stateless JWT implementation, logout is typically handled on the client side
        // by removing the token. However, you could implement token blacklisting here if needed.
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request);
            return ResponseEntity.ok(ApiResponse.success("Password reset instructions sent to your email (check console in dev mode)."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(ApiResponse.success("Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

