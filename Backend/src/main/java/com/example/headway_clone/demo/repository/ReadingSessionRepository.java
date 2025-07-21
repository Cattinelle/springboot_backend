package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.ReadingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReadingSessionRepository extends JpaRepository<ReadingSession, UUID> {
    List<ReadingSession> findByUserId(UUID userId);
} 