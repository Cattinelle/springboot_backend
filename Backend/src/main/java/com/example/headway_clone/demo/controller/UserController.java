package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * We are creating this UserController to handle all HTTP requests related to user profile management,
 * friendships, and weekly reading goals. This REST controller exposes endpoints for the React Native
 * frontend to manage user accounts, social features, and personal goal tracking.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get current user's complete profile information including weekly goals
     * Frontend calls this to display user's private profile with all details
     * GET /api/users/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        UserProfileDto profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update user profile information (name, bio, country, etc.)
     * Frontend calls this from the edit profile page when user saves changes
     * PUT /api/users/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateUserProfile(
            @RequestBody UpdateUserProfileRequest request,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        UserProfileDto updatedProfile = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Set or update user's weekly reading goal
     * Frontend calls this when user sets their weekly book completion target
     * POST /api/users/weekly-goal
     */
    @PostMapping("/weekly-goal")
    public ResponseEntity<WeeklyGoalDto> setWeeklyGoal(
            @RequestBody SetWeeklyGoalRequest request,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        WeeklyGoalDto weeklyGoal = userService.setWeeklyGoal(userId, request);
        return ResponseEntity.ok(weeklyGoal);
    }

    /**
     * Get current weekly goal progress
     * Frontend calls this to display weekly goal progress on dashboard
     * GET /api/users/weekly-goal
     */
    @GetMapping("/weekly-goal")
    public ResponseEntity<WeeklyGoalDto> getWeeklyGoal(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        WeeklyGoalDto weeklyGoal = userService.getWeeklyGoal(userId);
        return ResponseEntity.ok(weeklyGoal);
    }

    /**
     * Update user's theme preference (light/dark mode)
     * Frontend calls this from settings page when user toggles theme
     * PUT /api/users/theme
     */
    @PutMapping("/theme")
    public ResponseEntity<UserProfileDto> updateThemePreference(
            @RequestParam("theme") String themePreference,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        UserProfileDto updatedProfile = userService.updateThemePreference(userId, themePreference);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Update user's notification preferences
     * Frontend calls this from settings page when user toggles notification preferences
     * PUT /api/users/notifications
     */
    @PutMapping("/notifications")
    public ResponseEntity<UserProfileDto> updateNotificationSettings(
            @RequestBody NotificationSettingsDto request,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        UserProfileDto updatedProfile = userService.updateNotificationSettings(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Send friend request to another user
     * Frontend calls this when user wants to add someone as friend
     * POST /api/users/friends/send
     */
    @PostMapping("/friends/send")
    public ResponseEntity<FriendRequestDto> sendFriendRequest(
            @RequestBody SendFriendRequestDto request,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        FriendRequestDto result = userService.sendFriendRequest(userId, request.getTargetUserId());
        return ResponseEntity.ok(result);
    }

    /**
     * Respond to a friend request (accept or decline)
     * Frontend calls this when user responds to received friend requests
     * PUT /api/users/friends/requests/{requestId}/respond
     */
    @PutMapping("/friends/requests/{requestId}/respond")
    public ResponseEntity<FriendRequestDto> respondToFriendRequest(
            @PathVariable UUID requestId,
            @RequestBody RespondToFriendRequestDto response,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        FriendRequestDto result = userService.respondToFriendRequest(userId, requestId, response);
        return ResponseEntity.ok(result);
    }

    /**
     * Get pending friend requests received by user
     * Frontend calls this to display incoming friend requests that need responses
     * GET /api/users/friends/requests/received
     */
    @GetMapping("/friends/requests/received")
    public ResponseEntity<List<FriendRequestDto>> getReceivedFriendRequests(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<FriendRequestDto> requests = userService.getReceivedFriendRequests(userId);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get pending friend requests sent by user
     * Frontend calls this to show requests with "pending" status
     * GET /api/users/friends/requests/sent
     */
    @GetMapping("/friends/requests/sent")
    public ResponseEntity<List<FriendRequestDto>> getSentFriendRequests(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<FriendRequestDto> requests = userService.getSentFriendRequests(userId);
        return ResponseEntity.ok(requests);
    }

    /**
     * Remove a friend from user's friend list
     * Frontend calls this when user wants to unfriend someone
     * DELETE /api/users/friends/{friendId}
     */
    @DeleteMapping("/friends/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @PathVariable UUID friendId,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        userService.removeFriend(userId, friendId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get user's friends list
     * Frontend calls this to display friends page with all user's friends
     * GET /api/users/friends
     */
    @GetMapping("/friends")
    public ResponseEntity<List<UserBasicDto>> getUserFriends(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<UserBasicDto> friends = userService.getUserFriends(userId);
        return ResponseEntity.ok(friends);
    }

    /**
     * Search for users by name or email for friend requests
     * Frontend calls this from the "Find Friends" page when user searches
     * GET /api/users/search?q={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserBasicDto>> searchUsers(
            @RequestParam("q") String searchTerm,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());
        List<UserBasicDto> searchResults = userService.searchUsers(userId, searchTerm);
        return ResponseEntity.ok(searchResults);
    }

    /**
     * Get public profile information for viewing other users
     * Frontend calls this when viewing someone else's profile page
     * GET /api/users/{userId}/profile
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserPublicProfileDto> getPublicProfile(@PathVariable UUID userId) {
        UserPublicProfileDto publicProfile = userService.getPublicProfile(userId);
        return ResponseEntity.ok(publicProfile);
    }
}
