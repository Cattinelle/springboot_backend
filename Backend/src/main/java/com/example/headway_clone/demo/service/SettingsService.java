package com.example.headway_clone.demo.service;

import org.springframework.stereotype.Service;
import com.example.headway_clone.demo.dto.NotificationSettingsDto;
import com.example.headway_clone.demo.model.NotificationSettings;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class SettingsService {
    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    public String getPrivacyPolicy() {
        // In a real app, load from DB or file
        return "This is the privacy policy.";
    }

    public String getTerms() {
        // In a real app, load from DB or file
        return "These are the terms and conditions.";
    }

    public String getHelp() {
        // In a real app, load from DB or file
        return "Help and support information.";
    }

    public NotificationSettingsDto getNotificationSettings(User user) {
        NotificationSettings settings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> notificationSettingsRepository.save(new NotificationSettings(user)));
        NotificationSettingsDto dto = new NotificationSettingsDto();
        dto.setEmailNotifications(settings.isEmailNotifications());
        dto.setPushNotifications(settings.isPushNotifications());
        return dto;
    }

    public void updateNotificationSettings(User user, NotificationSettingsDto dto) {
        NotificationSettings settings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> new NotificationSettings(user));
        settings.setEmailNotifications(dto.isEmailNotifications());
        settings.setPushNotifications(dto.isPushNotifications());
        notificationSettingsRepository.save(settings);
    }
} 