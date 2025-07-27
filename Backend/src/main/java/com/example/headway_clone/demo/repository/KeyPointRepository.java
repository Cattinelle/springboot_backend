package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.KeyPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for KeyPoint entity operations.
 * Handles book key points/chapters for reading content management.
 * Updated to remove sequence-related methods since sequenceNumber field was removed from KeyPoint model.
 */
@Repository
public interface KeyPointRepository extends JpaRepository<KeyPoint, Long> {

    // Find all key points for a specific book
    List<KeyPoint> findByBookId(Long bookId);

    // Find a specific key point by book and title
    Optional<KeyPoint> findByBookIdAndTitle(Long bookId, String title);

    // Count total key points for a book
    long countByBookId(Long bookId);

    // Find key points by title (search functionality)
    List<KeyPoint> findByTitleContainingIgnoreCase(String title);

    // Find key points by summary content (search within summaries)
    List<KeyPoint> findBySummaryContainingIgnoreCase(String searchTerm);

    // Find key points by title OR summary (comprehensive search)
    @Query("SELECT kp FROM KeyPoint kp WHERE LOWER(kp.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(kp.summary) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<KeyPoint> searchKeyPointsByTitleOrSummary(@Param("searchTerm") String searchTerm);

    // Find key points by estimated reading time
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.estimatedReadTimeMinutes <= :maxMinutes")
    List<KeyPoint> findByMaxReadingTime(@Param("maxMinutes") Integer maxMinutes);

    // Find key points with reading time within a range
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.estimatedReadTimeMinutes BETWEEN :minMinutes AND :maxMinutes")
    List<KeyPoint> findByReadingTimeRange(@Param("minMinutes") Integer minMinutes, @Param("maxMinutes") Integer maxMinutes);

    // Find key points by book with insights
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.book.id = :bookId AND kp.insights IS NOT EMPTY")
    List<KeyPoint> findByBookIdWithInsights(@Param("bookId") Long bookId);

    // Find key points without insights
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.book.id = :bookId AND (kp.insights IS EMPTY OR kp.insights IS NULL)")
    List<KeyPoint> findByBookIdWithoutInsights(@Param("bookId") Long bookId);

    // Find random key points for a book (for random reading feature)
    @Query(value = "SELECT * FROM key_points WHERE book_id = :bookId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<KeyPoint> findRandomKeyPointsByBook(@Param("bookId") Long bookId, @Param("limit") int limit);

    // Find key points for multiple books (for collections)
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.book.id IN :bookIds")
    List<KeyPoint> findByBookIds(@Param("bookIds") List<Long> bookIds);

    // Get average reading time for a book's key points
    @Query("SELECT AVG(kp.estimatedReadTimeMinutes) FROM KeyPoint kp WHERE kp.book.id = :bookId")
    Double getAverageReadingTimeByBook(@Param("bookId") Long bookId);

    // Get total estimated reading time for a book
    @Query("SELECT SUM(kp.estimatedReadTimeMinutes) FROM KeyPoint kp WHERE kp.book.id = :bookId")
    Integer getTotalEstimatedReadingTimeByBook(@Param("bookId") Long bookId);

    // Find key points by minimum estimated reading time
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.estimatedReadTimeMinutes >= :minMinutes")
    List<KeyPoint> findByMinReadingTime(@Param("minMinutes") Integer minMinutes);

    // Find key points for books in a specific category
    @Query("SELECT kp FROM KeyPoint kp WHERE kp.book.category.id = :categoryId")
    List<KeyPoint> findByBookCategory(@Param("categoryId") Long categoryId);

    // Count key points by reading time range (for analytics)
    @Query("SELECT COUNT(kp) FROM KeyPoint kp WHERE kp.estimatedReadTimeMinutes BETWEEN :minMinutes AND :maxMinutes")
    long countByReadingTimeRange(@Param("minMinutes") Integer minMinutes, @Param("maxMinutes") Integer maxMinutes);
}
