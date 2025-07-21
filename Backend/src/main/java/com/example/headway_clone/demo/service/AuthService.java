package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.dto.JwtResponse;
import com.example.headway_clone.demo.dto.LoginRequest;
import com.example.headway_clone.demo.dto.RegisterRequest;
import com.example.headway_clone.demo.dto.ForgotPasswordRequest;
import com.example.headway_clone.demo.dto.ResetPasswordRequest;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.model.PasswordResetToken;
import com.example.headway_clone.demo.repository.UserRepository;
import com.example.headway_clone.demo.repository.PasswordResetTokenRepository;
import com.example.headway_clone.demo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail(), 
                                             getUserByEmail(loginRequest.getEmail()).getId());
        
        User user = getUserByEmail(loginRequest.getEmail());
        
        // Update last login time
        userRepository.updateLastLoginTime(user.getId(), LocalDateTime.now());
        
        return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getFirstName(), 
                              user.getLastName(), user.getAvatarUrl(), user.getSubscriptionType());
    }
    
    @Transactional
    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User(
            registerRequest.getEmail(),
            passwordEncoder.encode(registerRequest.getPassword()),
            registerRequest.getFirstName(),
            registerRequest.getLastName()
        );
        
        return userRepository.save(user);
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with this email");
        }
        User user = userOpt.get();
        // Remove any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        // Generate token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);
        PasswordResetToken resetToken = new PasswordResetToken(user, token, expiry);
        passwordResetTokenRepository.save(resetToken);
        // In a real app, send the token to the user's email
        System.out.println("Password reset token for " + user.getEmail() + ": " + token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(request.getToken());
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Invalid or expired token");
        }
        PasswordResetToken resetToken = tokenOpt.get();
        if (!resetToken.getUser().getEmail().equals(request.getEmail())) {
            throw new RuntimeException("Invalid token for this email");
        }
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}
