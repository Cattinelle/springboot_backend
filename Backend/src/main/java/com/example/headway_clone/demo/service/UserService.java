package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.FriendRequest;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.FriendRequestRepository;
import com.example.headway_clone.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * We are creating this UserService to handle user profile management, friendships, and weekly goal operations.
 * This service manages user data updates, friend relationships through FriendRequest entity, and weekly reading goal tracking
 * while ensuring proper data validation and business logic enforcement.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;

    /**
     * Get user profile information including current weekly goal progress
     * This method ensures weekly progress is reset if needed before returning data
     */
    public UserProfileDto getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure weekly progress is current before returning profile
        user.checkAndResetWeeklyProgress();
        userRepository.save(user);

        return convertToProfileDto(user);
    }

    /**
     * Update user profile information (name, bio, country, etc.)
     * This handles profile updates from the edit profile page
     */
    public UserProfileDto updateUserProfile(UUID userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update profile fields if provided
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User saved = userRepository.save(user);
        return convertToProfileDto(saved);
    }

    /**
     * Set or update user's weekly reading goal
     * This is a private goal not visible on public profile
     */
    public WeeklyGoalDto setWeeklyGoal(UUID userId, SetWeeklyGoalRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Reset weekly progress when goal is changed
        user.setWeeklyGoalBooks(request.getGoalBooks());
        user.setWeeklyProgress(0);
        user.setWeekStartDate(LocalDate.now());

        User saved = userRepository.save(user);
        return convertToWeeklyGoalDto(saved);
    }

    /**
     * Get current weekly goal progress
     * Returns goal, progress, and percentage for UI display
     */
    public WeeklyGoalDto getWeeklyGoal(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure weekly progress is current
        user.checkAndResetWeeklyProgress();
        userRepository.save(user);

        return convertToWeeklyGoalDto(user);
    }

    /**
     * Update user's theme preference (light/dark mode)
     * Frontend calls this from settings page when user toggles theme
     */
    public UserProfileDto updateThemePreference(UUID userId, String themePreference) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setThemePreference(User.ThemePreference.valueOf(themePreference.toUpperCase()));
        User saved = userRepository.save(user);
        return convertToProfileDto(saved);
    }

    /**
     * Update notification settings (streak, daily reminder, new releases)
     * Frontend calls this from settings page when user toggles notification preferences
     */
    public UserProfileDto updateNotificationSettings(UUID userId, NotificationSettingsDto request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update notification settings if provided
        if (request.getStreakNotificationsEnabled() != null) {
            user.setStreakNotificationsEnabled(request.getStreakNotificationsEnabled());
        }
        if (request.getDailyReminderEnabled() != null) {
            user.setDailyReminderEnabled(request.getDailyReminderEnabled());
        }
        if (request.getNewReleasesNotificationsEnabled() != null) {
            user.setNewReleasesNotificationsEnabled(request.getNewReleasesNotificationsEnabled());
        }

        User savedUser = userRepository.save(user);
        return convertToProfileDto(savedUser);
    }

    /**
     * Send friend request to another user
     * Frontend calls this when user wants to add someone as friend
     */
    public FriendRequestDto sendFriendRequest(UUID userId, UUID targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }

        User sender = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        User receiver = userRepository.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("Target user not found"));

        // Check if any friend request already exists between these users
        var existingRequest = friendRequestRepository.findExistingFriendRequest(userId, targetUserId);
        if (existingRequest.isPresent()) {
            FriendRequest existing = existingRequest.get();
            if (existing.getStatus() == FriendRequest.FriendshipStatus.PENDING) {
                throw new RuntimeException("Friend request already exists");
            } else if (existing.getStatus() == FriendRequest.FriendshipStatus.ACCEPTED) {
                throw new RuntimeException("Users are already friends");
            }
        }

        // Create new friend request
        FriendRequest friendRequest = FriendRequest.builder()
            .sender(sender)
            .receiver(receiver)
            .status(FriendRequest.FriendshipStatus.PENDING)
            .build();

        FriendRequest saved = friendRequestRepository.save(friendRequest);
        return convertToFriendRequestDto(saved, userId);
    }

    /**
     * Respond to a friend request (accept or decline)
     * Frontend calls this when user responds to received friend requests
     */
    public FriendRequestDto respondToFriendRequest(UUID userId, UUID requestId, RespondToFriendRequestDto response) {
        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friend request not found"));

        // Verify this user is the receiver of the request
        if (!friendRequest.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("You can only respond to requests sent to you");
        }

        // Verify request is still pending
        if (friendRequest.getStatus() != FriendRequest.FriendshipStatus.PENDING) {
            throw new RuntimeException("This friend request has already been responded to");
        }

        // Update status based on response (compare enums or strings safely)
        if ("ACCEPT".equalsIgnoreCase(String.valueOf(response.getAction()))) {
            friendRequest.setStatus(FriendRequest.FriendshipStatus.ACCEPTED);
        } else if ("DECLINE".equalsIgnoreCase(String.valueOf(response.getAction()))) {
            friendRequest.setStatus(FriendRequest.FriendshipStatus.DECLINED);
        } else {
            throw new RuntimeException("Invalid response action. Use ACCEPT or DECLINE");
        }

        FriendRequest saved = friendRequestRepository.save(friendRequest);
        return convertToFriendRequestDto(saved, userId);
    }

    /**
     * Remove/unfriend a user
     * This sets the friendship status to DECLINED, effectively removing the friendship
     */
    public void removeFriend(UUID userId, UUID friendId) {
        var friendRequest = friendRequestRepository.findExistingFriendRequest(userId, friendId)
            .orElseThrow(() -> new RuntimeException("No friendship exists between these users"));

        if (friendRequest.getStatus() != FriendRequest.FriendshipStatus.ACCEPTED) {
            throw new RuntimeException("Users are not friends");
        }

        // Remove the friendship by deleting the record
        friendRequestRepository.delete(friendRequest);
    }

    /**
     * Get user's friends list (accepted friendships)
     * Returns users who have accepted friendship with current user
     */
    public List<UserBasicDto> getUserFriends(UUID userId) {
        List<FriendRequest> acceptedFriendships = friendRequestRepository.findAcceptedFriendships(userId);

        return acceptedFriendships.stream()
            .map(fr -> {
                User friend = fr.getOtherUser(userRepository.findById(userId).orElseThrow());
                return convertToBasicDto(friend);
            })
            .collect(Collectors.toList());
    }

    /**
     * Get pending friend requests received by user
     * These are requests the user can accept or decline
     */
    public List<FriendRequestDto> getReceivedFriendRequests(UUID userId) {
        List<FriendRequest> pendingRequests = friendRequestRepository
            .findByReceiverIdAndStatus(userId, FriendRequest.FriendshipStatus.PENDING);

        return pendingRequests.stream()
            .map(fr -> convertToFriendRequestDto(fr, userId))
            .collect(Collectors.toList());
    }

    /**
     * Get pending friend requests sent by user
     * These show as "pending" to the user who sent them
     */
    public List<FriendRequestDto> getSentFriendRequests(UUID userId) {
        List<FriendRequest> sentRequests = friendRequestRepository
            .findBySenderIdAndStatus(userId, FriendRequest.FriendshipStatus.PENDING);

        return sentRequests.stream()
            .map(fr -> convertToFriendRequestDto(fr, userId))
            .collect(Collectors.toList());
    }

    /**
     * Search for users by name or email for friend requests
     * Excludes current user, existing friends, and users with pending requests
     */
    public List<UserBasicDto> searchUsers(UUID currentUserId, String searchTerm) {
        List<User> allUsers = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            searchTerm, searchTerm);

        return allUsers.stream()
            .filter(user -> !user.getId().equals(currentUserId))
            .filter(user -> {
                // Exclude if any friend request exists (pending or accepted)
                var existingRequest = friendRequestRepository.findExistingFriendRequest(currentUserId, user.getId());
                return existingRequest.isEmpty();
            })
            .map(this::convertToBasicDto)
            .collect(Collectors.toList());
    }

    /**
     * Get public profile information for viewing other users
     * This shows only publicly visible information
     */
    public UserPublicProfileDto getPublicProfile(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return UserPublicProfileDto.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .bio(user.getBio())
            .country(user.getCountry())
            .createdAt(user.getCreatedAt())
            .build();
    }

    // Helper methods for DTO conversion

    /**
     * Convert User entity to UserProfileDto for private profile viewing
     * Includes all user information including weekly goals and preferences
     */
    private UserProfileDto convertToProfileDto(User user) {
        return UserProfileDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .dateOfBirth(user.getDateOfBirth())
            .phoneNumber(user.getPhoneNumber())
            .avatarUrl(user.getAvatarUrl())
            .bio(user.getBio())
            .country(user.getCountry())
            .themePreference(user.getThemePreference()) // Pass enum directly
            .streakNotificationsEnabled(user.getStreakNotificationsEnabled())
            .dailyReminderEnabled(user.getDailyReminderEnabled())
            .newReleasesNotificationsEnabled(user.getNewReleasesNotificationsEnabled())
            .createdAt(user.getCreatedAt())
            .weeklyGoal(convertToWeeklyGoalDto(user))
            .build();
    }

    /**
     * Convert User entity to UserBasicDto for friend lists and search results
     * Shows only essential public information for friend management
     */
    private UserBasicDto convertToBasicDto(User user) {
        return UserBasicDto.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .country(user.getCountry())
            .build();
    }

    /**
     * Convert User weekly goal data to WeeklyGoalDto
     * Includes current progress and percentage calculation
     */
    private WeeklyGoalDto convertToWeeklyGoalDto(User user) {
        return WeeklyGoalDto.builder()
            .goalBooks(user.getWeeklyGoalBooks())
            .progress(user.getWeeklyProgress())
            .progressPercentage(user.getWeeklyProgressPercentage() == null ? null : user.getWeeklyProgressPercentage().doubleValue())
            .weekStartDate(user.getWeekStartDate())
            .build();
    }

    /**
     * Convert FriendRequest entity to FriendRequestDto for API responses
     * Shows the other user's info and request details from current user's perspective
     */
    private FriendRequestDto convertToFriendRequestDto(FriendRequest friendRequest, UUID userId) {
        User otherUser;
        String requestType;
        if (friendRequest.getSender().getId().equals(userId)) {
            otherUser = friendRequest.getReceiver();
            requestType = "SENT";
        } else {
            otherUser = friendRequest.getSender();
            requestType = "RECEIVED";
        }
        return FriendRequestDto.builder()
            .id(friendRequest.getId())
            .otherUser(convertToBasicDto(otherUser))
            .status(friendRequest.getStatus()) // Pass enum directly
            .requestType(requestType)
            .createdAt(friendRequest.getCreatedAt())
            .acceptedAt(friendRequest.getAcceptedAt())
            .build();
    }
}
