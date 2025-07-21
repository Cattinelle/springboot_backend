package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Highlight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface HighlightRepository extends JpaRepository<Highlight, UUID> {
    List<Highlight> findByUserId(UUID userId);
} 