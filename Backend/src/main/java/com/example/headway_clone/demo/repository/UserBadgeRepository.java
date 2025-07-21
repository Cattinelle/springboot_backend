package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    List<UserBadge> findByUserId(UUID userId);
} 