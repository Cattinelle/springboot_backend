package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.PasswordResetToken;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
} 