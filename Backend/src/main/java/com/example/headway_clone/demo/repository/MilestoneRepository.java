package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Milestone;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    Optional<Milestone> findByUser(User user);
} 