package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.UserProfileDto;
import com.example.headway_clone.demo.model.UserProfile;
import com.example.headway_clone.demo.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    public List<UserProfileDto> getAllProfiles() {
        return userProfileService.getAllProfiles().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserProfileDto getProfileById(@PathVariable UUID id) {
        Optional<UserProfile> profile = userProfileService.getProfileById(id);
        return profile.map(this::toDto).orElse(null);
    }

    @PostMapping
    public UserProfileDto createProfile(@RequestBody UserProfileDto dto) {
        UserProfile profile = toEntity(dto);
        return toDto(userProfileService.saveProfile(profile));
    }

    @PutMapping("/{id}")
    public UserProfileDto updateProfile(@PathVariable UUID id, @RequestBody UserProfileDto dto) {
        UserProfile profile = toEntity(dto);
        profile.setId(id);
        return toDto(userProfileService.saveProfile(profile));
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable UUID id) {
        userProfileService.deleteProfile(id);
    }

    private UserProfileDto toDto(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser() != null ? profile.getUser().getId() : null);
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBio(profile.getBio());
        return dto;
    }

    private UserProfile toEntity(UserProfileDto dto) {
        UserProfile profile = new UserProfile();
        profile.setId(dto.getId());
        // Set user if needed (requires UserRepository)
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setBio(dto.getBio());
        return profile;
    }
} 