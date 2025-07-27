package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity operations.
 * Provides user authentication, profile management, and friend search functionality.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // Authentication methods
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Find active users only
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    // Search users for friend requests (by name or email)
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);

    // Find users by country
    List<User> findByCountry(String country);

    // Update last login time
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLogin = :loginTime WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") UUID userId, @Param("loginTime") LocalDateTime loginTime);
    
    // Find users with active reading streaks
    @Query("SELECT u FROM User u JOIN u.milestone m WHERE m.dailyStreak > 0")
    List<User> findUsersWithActiveStreaks();

    // Find users by theme preference
    List<User> findByThemePreference(User.ThemePreference themePreference);

    // Count users by country (for analytics)
    long countByCountry(String country);

    // Find recently registered users
    @Query("SELECT u FROM User u WHERE u.createdAt >= :sinceDate ORDER BY u.createdAt DESC")
    List<User> findRecentlyRegisteredUsers(@Param("sinceDate") LocalDateTime sinceDate);

    // Find users with notification preferences enabled
    List<User> findByStreakNotificationsEnabledTrue();
    List<User> findByDailyReminderEnabledTrue();
    List<User> findByNewReleasesNotificationsEnabledTrue();
}
