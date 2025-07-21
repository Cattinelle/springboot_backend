package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Recommendation;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    List<Recommendation> findByUser(User user);
} 