package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    UserProfile findByUserId(UUID userId);
} 