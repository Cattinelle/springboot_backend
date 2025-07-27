package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.model.Book;
import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.model.UserBook;
import com.example.headway_clone.demo.repository.BookRepository;
import com.example.headway_clone.demo.repository.UserBookRepository;
import com.example.headway_clone.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * We are creating this UserBookService to handle all business logic for user-book relationships.
 * This service manages reading progress, favorites, recommendations, and library operations
 * while ensuring data integrity and proper authorization checks.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserBookService {

    // Dependency injection for repository layers
    // These handle all database operations for our service
    private final UserBookRepository userBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Add MilestoneService for streak and reading time tracking
    private final MilestoneService milestoneService;

    /**
     * Add a book to user's library (reading, favorite, recommendation)
     * This method handles the initial relationship creation between user and book
     */
    public UserBookDto addBookToUserLibrary(UUID userId, AddUserBookRequest request) {
        // Check if relationship already exists to prevent duplicates
        // This ensures data integrity in our user_books table
        if (userBookRepository.existsByUserIdAndBookId(userId, request.getBookId())) {
            throw new RuntimeException("Book already exists in user's library");
        }

        // Fetch the user entity and validate existence
        // This ensures we have a valid user before creating relationships
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch the book entity and validate existence
        // This ensures we're linking to a valid book in our catalog
        Book book = bookRepository.findById(request.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found"));

        // Create new UserBook entity with the provided parameters
        // Builder pattern ensures clean object construction
        UserBook userBook = UserBook.builder()
            .user(user)                                                    // Set the user relationship
            .book(book)                                                    // Set the book relationship
            .status(UserBook.ReadingStatus.valueOf(request.getStatus()))   // Set reading status (READING, SAVED_FOR_LATER, etc.)
            .isFavorite(request.getIsFavorite())                          // Set favorite flag
            .isRecommended(request.getIsRecommended())                    // Set recommendation flag
            .progressPercentage(0)                                        // Initialize progress to 0%
            .completedKeyPoints(0)                                        // Initialize completed key points to 0
            .build();

        // Save to database and return DTO representation
        UserBook saved = userBookRepository.save(userBook);
        return convertToDto(saved);
    }

    /**
     * Update reading status (READING, SAVED_FOR_LATER, COMPLETED)
     * This handles status changes within the book summary interface
     */
    public UserBookDto updateReadingStatus(UUID userId, UpdateUserBookStatusRequest request) {
        // Fetch the specific UserBook relationship
        UserBook userBook = userBookRepository.findById(request.getUserBookId())
            .orElseThrow(() -> new RuntimeException("UserBook not found"));

        // Security check: ensure user owns this book relationship
        // This prevents unauthorized access to other users' library data
        if (!userBook.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to user book");
        }

        // Update the reading status
        // This will trigger @PreUpdate lifecycle method for timestamp updates
        userBook.setStatus(UserBook.ReadingStatus.valueOf(request.getStatus()));

        // Save changes and return updated DTO
        UserBook saved = userBookRepository.save(userBook);
        return convertToDto(saved);
    }

    /**
     * Toggle favorite status for a book
     * This method handles adding/removing books from favorites collection
     */
    public UserBookDto toggleFavorite(UUID userId, ToggleFavoriteRequest request) {
        // Try to find existing UserBook relationship, or create new one if it doesn't exist
        // This allows favorite books that aren't in the user's active reading list
        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, request.getBookId())
            .orElseGet(() -> {
                // Create new UserBook if relationship doesn't exist
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

                // Initialize with NOT_STARTED status for favorites-only books
                return UserBook.builder()
                    .user(user)
                    .book(book)
                    .status(UserBook.ReadingStatus.NOT_STARTED)
                    .isFavorite(false)
                    .isRecommended(false)
                    .progressPercentage(0)
                    .completedKeyPoints(0)
                    .build();
            });

        // Update the favorite flag based on request
        userBook.setIsFavorite(request.getIsFavorite());

        // Save and return updated relationship
        UserBook saved = userBookRepository.save(userBook);
        return convertToDto(saved);
    }

    /**
     * Toggle recommendation status for a book
     * This method handles adding/removing books from recommendations collection
     */
    public UserBookDto toggleRecommendation(UUID userId, ToggleRecommendationRequest request) {
        // Try to find existing UserBook relationship, or create new one if doesn't exist
        // This allows recommending books that aren't in the user's active reading list
        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, request.getBookId())
            .orElseGet(() -> {
                // Create new UserBook if relationship doesn't exist
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

                // Initialize with NOT_STARTED status for recommendation-only books
                return UserBook.builder()
                    .user(user)
                    .book(book)
                    .status(UserBook.ReadingStatus.NOT_STARTED)
                    .isFavorite(false)
                    .isRecommended(false)
                    .progressPercentage(0)
                    .completedKeyPoints(0)
                    .build();
            });

        // Update the recommendation flag based on request
        userBook.setIsRecommended(request.getIsRecommended());

        // Save and return updated relationship
        UserBook saved = userBookRepository.save(userBook);
        return convertToDto(saved);
    }

    /**
     * Update reading progress and handle milestone tracking
     */
    public UserBookDto updateProgress(UUID userId, UpdateBookProgressRequest request) {
        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, request.getBookId())
            .orElseThrow(() -> new RuntimeException("UserBook not found"));

        userBook.setCurrentKeyPointId(request.getCurrentKeyPointId());
        userBook.setCompletedKeyPoints(request.getCompletedKeyPoints());
        userBook.setProgressPercentage(request.getProgressPercentage());

        // Auto-complete if 100% progress and update milestones + weekly goal
        if (request.getProgressPercentage() >= 100) {
            userBook.setStatus(UserBook.ReadingStatus.COMPLETED);

            // Update milestones when book is completed
            milestoneService.incrementCompletedBooks(userId);

            // Update user's weekly reading goal progress
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.incrementWeeklyProgress();
            userRepository.save(user);
        }

        UserBook saved = userBookRepository.save(userBook);
        return convertToDto(saved);
    }

    /**
     * Add reading time when user finishes a reading session
     * Frontend calculates time spent and sends it when user closes key points page
     */
    public void addReadingTime(UUID userId, ReadingTimeRequest request) {
        // Validate that the book exists in user's library
        userBookRepository.findByUserIdAndBookId(userId, request.getBookId())
            .orElseThrow(() -> new RuntimeException("UserBook not found"));

        // Add reading time to user's total
        milestoneService.addReadingTime(userId, request.getMinutesSpent());
    }

    /**
     * Get all books in user's library
     */
    public List<UserBookDto> getUserLibrary(UUID userId) {
        List<UserBook> userBooks = userBookRepository.findByUserId(userId);
        return userBooks.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get books by status (READING, SAVED_FOR_LATER, COMPLETED)
     */
    public List<UserBookDto> getBooksByStatus(UUID userId, String status) {
        UserBook.ReadingStatus readingStatus = UserBook.ReadingStatus.valueOf(status);
        List<UserBook> userBooks = userBookRepository.findByUserIdAndStatus(userId, readingStatus);
        return userBooks.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get user's favorite books that they want to share with others
     * These books appear on the user's public profile as their favorites
     */
    public List<UserBookDto> getFavoriteBooks(UUID userId) {
        List<UserBook> favorites = userBookRepository.findByUserIdAndIsFavoriteTrue(userId);
        return favorites.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get books the user is recommending to others
     * These books appear on the user's public profile as their recommendations
     */
    public List<UserBookDto> getRecommendedBooks(UUID userId) {
        List<UserBook> recommended = userBookRepository.findByUserIdAndIsRecommendedTrue(userId);
        return recommended.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get currently reading books ordered by last read
     */
    public List<UserBookDto> getCurrentlyReading(UUID userId) {
        List<UserBook> reading = userBookRepository.findByUserIdAndStatusOrderByLastReadAtDesc(
            userId, UserBook.ReadingStatus.READING);
        return reading.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get books in progress for "Continue Reading"
     */
    public List<UserBookDto> getBooksInProgress(UUID userId) {
        List<UserBook> inProgress = userBookRepository.findBooksInProgressByUserId(userId);
        return inProgress.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    /**
     * Remove book from user's library
     * This method handles complete removal of user-book relationship
     * Updated to use UUID bookId to match Book entity
     */
    public void removeBookFromLibrary(UUID userId, Long bookId) {
        // Find the user-book relationship using UUID bookId type
        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, bookId)
            .orElseThrow(() -> new RuntimeException("UserBook not found"));

        // Delete the relationship from database
        userBookRepository.delete(userBook);
    }

    /**
     * Get user's reading statistics for library dashboard
     * Returns actual book lists instead of counts - frontend can use .length to get counts
     */
    public UserLibraryStatsDto getUserLibraryStats(UUID userId) {
        // Get books by different reading statuses
        List<UserBook> reading = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.READING);
        List<UserBook> savedForLater = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.SAVED_FOR_LATER);
        List<UserBook> completed = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.COMPLETED);

        // Convert to DTOs for frontend consumption
        List<UserBookDto> currentlyReadingDtos = reading.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());

        List<UserBookDto> savedForLaterDtos = savedForLater.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());

        List<UserBookDto> completedBooksDtos = completed.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());

        return UserLibraryStatsDto.builder()
            .currentlyReading(currentlyReadingDtos)
            .savedForLater(savedForLaterDtos)
            .completedBooks(completedBooksDtos)
            .build();
    }

    /**
     * Get user's profile statistics including favorites and recommendations
     * Returns actual book lists and real milestone data for streak and reading time
     */
    public UserProfileStatsDto getUserProfileStats(UUID userId) {
        // Get profile-specific book lists
        List<UserBook> favorites = userBookRepository.findByUserIdAndIsFavoriteTrue(userId);
        List<UserBook> recommended = userBookRepository.findByUserIdAndIsRecommendedTrue(userId);
        Long completedCount = userBookRepository.countCompletedBooksByUserId(userId);

        // Convert book lists to DTOs for frontend consumption
        List<UserBookDto> favoriteBooksDto = favorites.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());

        List<UserBookDto> recommendedBooksDto = recommended.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());

        // Get real milestone data for streak and reading time
        var milestone = milestoneService.getUserMilestone(userId);

        return UserProfileStatsDto.builder()
            .favoriteBooks(favoriteBooksDto)
            .recommendedBooks(recommendedBooksDto)
            .totalBooksCompleted(completedCount.intValue())
            .currentStreak(milestone.getDailyStreak())                    // Real streak data
            .totalReadingTimeMinutes(milestone.getTotalReadingTimeMinutes()) // Real reading time
            .build();
    }

    /**
     * Convert UserBook entity to DTO for frontend consumption
     * This method transforms database entities into DTOs that the React Native app expects
     * Updated to properly handle UUID Book IDs
     */
    private UserBookDto convertToDto(UserBook userBook) {
        // Build BookDto with proper UUID handling - no conversion needed now
        BookDto bookDto = BookDto.builder()
            .id(userBook.getBook().getId())                                // Direct UUID mapping - no conversion needed
            .title(userBook.getBook().getTitle())                          // Book title for display
            .author(userBook.getBook().getAuthor())                        // Author name for display
            .category(userBook.getBook().getCategory().getName())          // Category name for filtering
            .cover(userBook.getBook().getCover())                          // Cover image URL for display
            .overview(userBook.getBook().getOverview())                    // Book description for summary page
            .aboutAuthor(userBook.getBook().getAboutAuthor())             // Author bio for details
            .status(userBook.getBook().getStatus().toString())            // Book catalog status
            .build();

        // Build UserBookDto with all user-specific data
        return UserBookDto.builder()
            .id(userBook.getId())                                          // UserBook relationship ID
            .userId(userBook.getUser().getId())                           // User who owns this relationship
            .book(bookDto)                                                 // Complete book information
            .status(userBook.getStatus().toString())                      // Reading status (READING, COMPLETED, etc.)
            .currentKeyPointId(userBook.getCurrentKeyPointId())           // Current reading position
            .completedKeyPoints(userBook.getCompletedKeyPoints())         // Progress tracking
            .progressPercentage(userBook.getProgressPercentage())         // Completion percentage for progress bars
            .isFavorite(userBook.getIsFavorite())                         // Favorite flag for heart icon
            .isRecommended(userBook.getIsRecommended())                   // Recommendation flag
            .startedAt(userBook.getStartedAt())                           // When user started reading
            .completedAt(userBook.getCompletedAt())                       // When user finished reading
            .lastReadAt(userBook.getLastReadAt())                         // Last activity timestamp
            .createdAt(userBook.getCreatedAt())                           // Relationship creation time
            .updatedAt(userBook.getUpdatedAt())                           // Last update time
            .build();
    }
}
