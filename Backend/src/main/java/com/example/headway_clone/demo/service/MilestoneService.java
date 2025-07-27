package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.Milestone;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.MilestoneRepository;
import com.example.headway_clone.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this MilestoneService to handle user achievements and progress tracking.
 * This service manages daily streaks with proper date logic, reading time, and milestone calculations
 * while ensuring streaks reset to 0 if user doesn't complete a book for the day.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;

    /**
     * Update user's daily streak when they complete a book
     * Proper streak logic: increment if consecutive day, reset to 1 if gap, maintain if same day
     */
    public void updateDailyStreak(UUID userId) {
        Milestone milestone = getOrCreateMilestone(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastCompletionDate = milestone.getLastCompletionDate() != null
            ? milestone.getLastCompletionDate().toLocalDate()
            : null;

        // Only update streak once per day
        if (lastCompletionDate == null || !lastCompletionDate.equals(today)) {
            if (lastCompletionDate != null && lastCompletionDate.equals(today.minusDays(1))) {
                // Consecutive day - increment streak
                milestone.setDailyStreak(milestone.getDailyStreak() + 1);
            } else {
                // First completion ever OR streak broken - start new streak
                milestone.setDailyStreak(1);
            }

            // Update last completion date
            milestone.setLastCompletionDate(LocalDateTime.now());
            milestoneRepository.save(milestone);
        }
        // If lastCompletionDate equals today, don't change streak (already counted today)
    }

    /**
     * Check and reset streak if user hasn't completed a book today
     * This should be called periodically or when user logs in
     */
    public void checkAndResetStreakIfNeeded(UUID userId) {
        Milestone milestone = getOrCreateMilestone(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastCompletionDate = milestone.getLastCompletionDate() != null
            ? milestone.getLastCompletionDate().toLocalDate()
            : null;

        // If user has a streak but hasn't completed a book today and it's past their last completion
        if (milestone.getDailyStreak() > 0 && lastCompletionDate != null) {
            long daysSinceLastCompletion = java.time.temporal.ChronoUnit.DAYS.between(lastCompletionDate, today);

            // If more than 1 day has passed since last completion, reset streak
            if (daysSinceLastCompletion > 1) {
                milestone.setDailyStreak(0);
                milestoneRepository.save(milestone);
            }
        }
    }

    /**
     * Add reading time to user's total when they finish reading key points
     * Time is calculated from when user opens key points to when they close them
     */
    public void addReadingTime(UUID userId, Integer minutesSpent) {
        Milestone milestone = getOrCreateMilestone(userId);
        milestone.setTotalReadingTimeMinutes(
            milestone.getTotalReadingTimeMinutes() + minutesSpent
        );
        milestoneRepository.save(milestone);
    }

    /**
     * Increment completed books count and update streak
     */
    public void incrementCompletedBooks(UUID userId) {
        Milestone milestone = getOrCreateMilestone(userId);
        milestone.setBooksCompleted(milestone.getBooksCompleted() + 1);
        milestoneRepository.save(milestone);

        // Update daily streak when a book is completed
        updateDailyStreak(userId);
    }

    /**
     * Get user's milestone data, creating one if it doesn't exist
     */
    public Milestone getOrCreateMilestone(UUID userId) {
        return milestoneRepository.findByUserId(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

                Milestone newMilestone = new Milestone();
                newMilestone.setUser(user);
                newMilestone.setDailyStreak(0);
                newMilestone.setBooksCompleted(0);
                newMilestone.setTotalReadingTimeMinutes(0);
                newMilestone.setLastCompletionDate(null);

                return milestoneRepository.save(newMilestone);
            });
    }

    /**
     * Get user's current milestone data and check for streak reset
     */
    public Milestone getUserMilestone(UUID userId) {
        // Check and reset streak if needed before returning milestone
        checkAndResetStreakIfNeeded(userId);
        return getOrCreateMilestone(userId);
    }
}
