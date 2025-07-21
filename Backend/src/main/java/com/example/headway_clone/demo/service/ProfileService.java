package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.*;
import com.example.headway_clone.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FriendshipRepository friendshipRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private RecommendationRepository recommendationRepository;
    @Autowired
    private FavoriteBookRepository favoriteBookRepository;

    public ProfileDto getProfile(User user) {
        ProfileDto dto = new ProfileDto();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCountry(user.getCountry());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBio(user.getBio());
        dto.setDateOfBirth(user.getDateOfBirth());
        return dto;
    }

    public void updateProfile(User user, ProfileDto dto) {
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setCountry(dto.getCountry());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setBio(dto.getBio());
        user.setDateOfBirth(dto.getDateOfBirth());
        userRepository.save(user);
    }

    public List<ProfileDto> findFriends(String query) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(u -> u.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                        u.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(query.toLowerCase()))
                .map(this::getProfile)
                .collect(Collectors.toList());
    }

    public MilestoneDto getMilestones(User user) {
        Optional<Milestone> milestone = milestoneRepository.findByUser(user);
        MilestoneDto dto = new MilestoneDto();
        milestone.ifPresent(m -> {
            dto.setDailyStreak(m.getDailyStreak());
            dto.setHighlights(m.getHighlights());
            dto.setBooksCompleted(m.getBooksCompleted());
        });
        return dto;
    }

    public List<RecommendationDto> getRecommendations(User user) {
        return recommendationRepository.findByUser(user).stream().map(r -> {
            RecommendationDto dto = new RecommendationDto();
            dto.setBookTitle(r.getBookTitle());
            dto.setAuthor(r.getAuthor());
            dto.setNote(r.getNote());
            return dto;
        }).collect(Collectors.toList());
    }

    public void addRecommendation(User user, RecommendationDto dto) {
        Recommendation rec = new Recommendation(user, dto.getBookTitle(), dto.getAuthor(), dto.getNote());
        recommendationRepository.save(rec);
    }

    public List<FavoriteBookDto> getFavoriteBooks(User user) {
        return favoriteBookRepository.findByUser(user).stream().map(fb -> {
            FavoriteBookDto dto = new FavoriteBookDto();
            dto.setBookTitle(fb.getBookTitle());
            dto.setAuthor(fb.getAuthor());
            return dto;
        }).collect(Collectors.toList());
    }

    public void addFavoriteBook(User user, FavoriteBookDto dto) {
        FavoriteBook fb = new FavoriteBook(user, dto.getBookTitle(), dto.getAuthor());
        favoriteBookRepository.save(fb);
    }
} 