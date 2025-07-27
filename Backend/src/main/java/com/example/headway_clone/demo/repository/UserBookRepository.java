package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for UserBook entity operations.
 * Handles user library management, reading progress, favorites, and recommendations.
 */
@Repository
public interface UserBookRepository extends JpaRepository<UserBook, UUID> {

    // Basic user-book relationship queries - Updated to use Long for bookId
    Optional<UserBook> findByUserIdAndBookId(UUID userId, Long bookId);
    boolean existsByUserIdAndBookId(UUID userId, Long bookId);

    // Find all books for a user
    List<UserBook> findByUserId(UUID userId);

    // Find books by status
    List<UserBook> findByUserIdAndStatus(UUID userId, UserBook.ReadingStatus status);

    // Find books by status ordered by last read date (for recently read books)
    List<UserBook> findByUserIdAndStatusOrderByLastReadAtDesc(UUID userId, UserBook.ReadingStatus status);

    // Find user's favorite books
    List<UserBook> findByUserIdAndIsFavoriteTrue(UUID userId);

    // Find user's recommended books
    List<UserBook> findByUserIdAndIsRecommendedTrue(UUID userId);

    // Custom query to find books in progress (reading status with some progress)
    @Query("SELECT ub FROM UserBook ub WHERE ub.user.id = :userId AND ub.status = 'READING' AND ub.progressPercentage > 0")
    List<UserBook> findBooksInProgressByUserId(@Param("userId") UUID userId);

    // Count completed books for user statistics
    @Query("SELECT COUNT(ub) FROM UserBook ub WHERE ub.user.id = :userId AND ub.status = 'COMPLETED'")
    Long countCompletedBooksByUserId(@Param("userId") UUID userId);

    // Additional useful queries for the service

    // Find recently started books
    @Query("SELECT ub FROM UserBook ub WHERE ub.user.id = :userId ORDER BY ub.startedAt DESC")
    List<UserBook> findByUserIdOrderByStartedAtDesc(UUID userId);

    // Find recently completed books
    @Query("SELECT ub FROM UserBook ub WHERE ub.user.id = :userId AND ub.status = 'COMPLETED' ORDER BY ub.completedAt DESC")
    List<UserBook> findCompletedBooksByUserIdOrderByCompletedAtDesc(UUID userId);

    // Find books with highest progress for dashboard
    @Query("SELECT ub FROM UserBook ub WHERE ub.user.id = :userId AND ub.status = 'READING' ORDER BY ub.progressPercentage DESC")
    List<UserBook> findReadingBooksByProgressDesc(UUID userId);

    // Find books by specific book ID for multiple users (for analytics)
    @Query("SELECT ub FROM UserBook ub WHERE ub.book.id = :bookId")
    List<UserBook> findByBookId(@Param("bookId") Long bookId);

    // Count users reading a specific book
    @Query("SELECT COUNT(ub) FROM UserBook ub WHERE ub.book.id = :bookId AND ub.status = 'READING'")
    Long countUsersReadingBook(@Param("bookId") Long bookId);
}
