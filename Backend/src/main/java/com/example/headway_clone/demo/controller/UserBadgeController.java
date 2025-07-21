package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.UserBadgeDto;
import com.example.headway_clone.demo.model.UserBadge;
import com.example.headway_clone.demo.service.UserBadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-badges")
public class UserBadgeController {
    @Autowired
    private UserBadgeService userBadgeService;

    @GetMapping
    public List<UserBadgeDto> getAllUserBadges() {
        return userBadgeService.getAllUserBadges().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<UserBadgeDto> getUserBadgesByUserId(@PathVariable UUID userId) {
        return userBadgeService.getUserBadgesByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserBadgeDto getUserBadgeById(@PathVariable UUID id) {
        Optional<UserBadge> userBadge = userBadgeService.getUserBadgeById(id);
        return userBadge.map(this::toDto).orElse(null);
    }

    @PostMapping
    public UserBadgeDto createUserBadge(@RequestBody UserBadgeDto dto) {
        UserBadge userBadge = toEntity(dto);
        return toDto(userBadgeService.saveUserBadge(userBadge));
    }

    @PutMapping("/{id}")
    public UserBadgeDto updateUserBadge(@PathVariable UUID id, @RequestBody UserBadgeDto dto) {
        UserBadge userBadge = toEntity(dto);
        userBadge.setId(id);
        return toDto(userBadgeService.saveUserBadge(userBadge));
    }

    @DeleteMapping("/{id}")
    public void deleteUserBadge(@PathVariable UUID id) {
        userBadgeService.deleteUserBadge(id);
    }

    private UserBadgeDto toDto(UserBadge userBadge) {
        UserBadgeDto dto = new UserBadgeDto();
        dto.setId(userBadge.getId());
        dto.setUserId(userBadge.getUser() != null ? userBadge.getUser().getId() : null);
        dto.setBadgeId(userBadge.getBadge() != null ? userBadge.getBadge().getId() : null);
        dto.setEarnedAt(userBadge.getEarnedAt());
        return dto;
    }

    private UserBadge toEntity(UserBadgeDto dto) {
        UserBadge userBadge = new UserBadge();
        userBadge.setId(dto.getId());
        // Set user and badge if needed (requires UserRepository/BadgeRepository)
        userBadge.setEarnedAt(dto.getEarnedAt());
        return userBadge;
    }
} 