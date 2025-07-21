package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.service.SettingsService;
import com.example.headway_clone.demo.dto.NotificationSettingsDto;
import com.example.headway_clone.demo.security.UserPrincipal;
import com.example.headway_clone.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    @Autowired
    private SettingsService settingsService;

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping("/notifications")
    public NotificationSettingsDto getNotificationSettings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return settingsService.getNotificationSettings(userPrincipal.getUser(userRepository));
    }

    @PutMapping("/notifications")
    public void updateNotificationSettings(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody NotificationSettingsDto dto) {
        settingsService.updateNotificationSettings(userPrincipal.getUser(userRepository), dto);
    }

    // Notification settings endpoints would go here
} 