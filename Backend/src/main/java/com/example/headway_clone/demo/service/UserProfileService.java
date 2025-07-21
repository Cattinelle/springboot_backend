package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.UserProfile;
import com.example.headway_clone.demo.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    public Optional<UserProfile> getProfileById(UUID id) {
        return userProfileRepository.findById(id);
    }

    public UserProfile saveProfile(UserProfile profile) {
        return userProfileRepository.save(profile);
    }

    public void deleteProfile(UUID id) {
        userProfileRepository.deleteById(id);
    }
} 