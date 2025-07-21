package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.NotificationSettings;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, UUID> {
    Optional<NotificationSettings> findByUser(User user);
} 