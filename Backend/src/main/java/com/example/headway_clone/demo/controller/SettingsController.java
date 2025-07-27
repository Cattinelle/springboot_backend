package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.service.SettingsService;
import com.example.headway_clone.demo.dto.NotificationSettingsDto;
import com.example.headway_clone.demo.dto.ApiResponse;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.security.UserPrincipal;
import com.example.headway_clone.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;

/**
 * We are creating this SettingsController to handle user preferences and settings.
 * This controller manages theme preferences and the three notification types in the settings page.
 */
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final UserRepository userRepository;

    @GetMapping("/privacy-policy")
    public String getPrivacyPolicy() {
        return settingsService.getPrivacyPolicy();
    }

    @GetMapping("/terms")
    public String getTerms() {
        return settingsService.getTerms();
    }

    @GetMapping("/help")
    public String getHelp() {
        return settingsService.getHelp();
    }

    /**
     * GET /api/settings/notifications - Get user's notification preferences
     * Returns the three notification toggles: streak, daily reminder, new releases
     */
    @GetMapping("/notifications")
    public ResponseEntity<NotificationSettingsDto> getNotificationSettings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser(userRepository);
        NotificationSettingsDto settings = settingsService.getNotificationSettings(user);
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/settings/notifications - Update user's notification preferences
     * Allows users to toggle: streak updates, daily reminders, new releases
     */
    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse> updateNotificationSettings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody NotificationSettingsDto dto) {
        User user = userPrincipal.getUser(userRepository);
        settingsService.updateNotificationSettings(user, dto);
        return ResponseEntity.ok(new ApiResponse(true, "Notification settings updated successfully"));
    }

    /**
     * GET /api/settings/theme - Get user's theme preference
     * Returns LIGHT or DARK theme preference
     */
    @GetMapping("/theme")
    public ResponseEntity<User.ThemePreference> getThemePreference(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser(userRepository);
        User.ThemePreference theme = settingsService.getThemePreference(user);
        return ResponseEntity.ok(theme);
    }

    /**
     * PUT /api/settings/theme - Update user's theme preference
     * Allows users to toggle between LIGHT and DARK modes
     */
    @PutMapping("/theme")
    public ResponseEntity<ApiResponse> updateThemePreference(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody User.ThemePreference themePreference) {
        User user = userPrincipal.getUser(userRepository);
        settingsService.updateThemePreference(user, themePreference);
        return ResponseEntity.ok(new ApiResponse(true, "Theme preference updated successfully"));
    }
}
