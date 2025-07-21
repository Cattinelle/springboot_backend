package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.UserBadge;
import com.example.headway_clone.demo.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserBadgeService {
    @Autowired
    private UserBadgeRepository userBadgeRepository;

    public List<UserBadge> getAllUserBadges() {
        return userBadgeRepository.findAll();
    }

    public Optional<UserBadge> getUserBadgeById(UUID id) {
        return userBadgeRepository.findById(id);
    }

    public List<UserBadge> getUserBadgesByUserId(UUID userId) {
        return userBadgeRepository.findByUserId(userId);
    }

    public UserBadge saveUserBadge(UserBadge userBadge) {
        return userBadgeRepository.save(userBadge);
    }

    public void deleteUserBadge(UUID id) {
        userBadgeRepository.deleteById(id);
    }
} 