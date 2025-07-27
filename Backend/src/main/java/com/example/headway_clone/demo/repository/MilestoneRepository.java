package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Milestone;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Milestone entity operations.
 * Handles user reading achievements, streaks, and reading time tracking.
 */
@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    // Find milestone by user
    Optional<Milestone> findByUser(User user);
    Optional<Milestone> findByUserId(UUID userId);

    // Find users with active streaks
    @Query("SELECT m FROM Milestone m WHERE m.dailyStreak > 0 ORDER BY m.dailyStreak DESC")
    List<Milestone> findUsersWithActiveStreaks();

    // Find top streaks (leaderboard functionality)
    @Query("SELECT m FROM Milestone m ORDER BY m.dailyStreak DESC")
    List<Milestone> findTopStreaks();

    // Find users with streaks above certain threshold
    @Query("SELECT m FROM Milestone m WHERE m.dailyStreak >= :minStreak")
    List<Milestone> findUsersWithMinStreak(@Param("minStreak") Integer minStreak);

    // Find most books completed (leaderboard)
    @Query("SELECT m FROM Milestone m ORDER BY m.booksCompleted DESC")
    List<Milestone> findTopBookReaders();

    // Find users who completed books above threshold
    @Query("SELECT m FROM Milestone m WHERE m.booksCompleted >= :minBooks")
    List<Milestone> findUsersWithMinBooksCompleted(@Param("minBooks") Integer minBooks);

    // Find users with most reading time
    @Query("SELECT m FROM Milestone m ORDER BY m.totalReadingTimeMinutes DESC")
    List<Milestone> findTopReaders();

    // Find users with reading time above threshold
    @Query("SELECT m FROM Milestone m WHERE m.totalReadingTimeMinutes >= :minMinutes")
    List<Milestone> findUsersWithMinReadingTime(@Param("minMinutes") Integer minMinutes);

    // Find recently active users (completed books recently)
    @Query("SELECT m FROM Milestone m WHERE m.lastCompletionDate >= :sinceDate ORDER BY m.lastCompletionDate DESC")
    List<Milestone> findRecentlyActiveUsers(@Param("sinceDate") LocalDateTime sinceDate);

    // Get average stats across all users
    @Query("SELECT AVG(m.dailyStreak) FROM Milestone m")
    Double getAverageStreak();

    @Query("SELECT AVG(m.booksCompleted) FROM Milestone m")
    Double getAverageBooksCompleted();

    @Query("SELECT AVG(m.totalReadingTimeMinutes) FROM Milestone m")
    Double getAverageReadingTime();

    // Count users with active streaks
    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.dailyStreak > 0")
    long countUsersWithActiveStreaks();
}
