package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.UserRepository;
import com.example.headway_clone.demo.security.UserPrincipal;
import com.example.headway_clone.demo.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ProfileDto getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return profileService.getProfile(userPrincipal.getUser(userRepository));
    }

    @PutMapping
    public void updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ProfileDto dto) {
        profileService.updateProfile(userPrincipal.getUser(userRepository), dto);
    }

    @GetMapping("/friends/search")
    public List<ProfileDto> findFriends(@RequestParam String query) {
        return profileService.findFriends(query);
    }

    @GetMapping("/milestones")
    public MilestoneDto getMilestones(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return profileService.getMilestones(userPrincipal.getUser(userRepository));
    }

    @GetMapping("/recommendations")
    public List<RecommendationDto> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return profileService.getRecommendations(userPrincipal.getUser(userRepository));
    }

    @PostMapping("/recommendations")
    public void addRecommendation(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody RecommendationDto dto) {
        profileService.addRecommendation(userPrincipal.getUser(userRepository), dto);
    }

    @GetMapping("/favorites")
    public List<FavoriteBookDto> getFavoriteBooks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return profileService.getFavoriteBooks(userPrincipal.getUser(userRepository));
    }

    @PostMapping("/favorites")
    public void addFavoriteBook(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody FavoriteBookDto dto) {
        profileService.addFavoriteBook(userPrincipal.getUser(userRepository), dto);
    }
} 