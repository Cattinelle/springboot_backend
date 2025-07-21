package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.Badge;
import com.example.headway_clone.demo.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BadgeService {
    @Autowired
    private BadgeRepository badgeRepository;

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public Optional<Badge> getBadgeById(UUID id) {
        return badgeRepository.findById(id);
    }

    public Badge saveBadge(Badge badge) {
        return badgeRepository.save(badge);
    }

    public void deleteBadge(UUID id) {
        badgeRepository.deleteById(id);
    }
} 