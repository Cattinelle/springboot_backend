package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {
} 