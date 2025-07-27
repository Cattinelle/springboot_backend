package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.*;
import com.example.headway_clone.demo.service.UserBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * We are creating this UserBookController to handle all HTTP requests related to user-book relationships.
 * This REST controller exposes endpoints for the React Native frontend to manage reading progress,
 * favorites, recommendations, and library operations. Each endpoint maps to specific frontend features.
 */
@RestController                    // Marks this as a REST controller that returns JSON responses
@RequestMapping("/api/user-books") // Base URL path for all user-book endpoints
@RequiredArgsConstructor          // Lombok generates constructor for final fields (dependency injection)
public class UserBookController {

    // Service layer dependency - handles all business logic
    // This separation keeps the controller focused on HTTP concerns only
    private final UserBookService userBookService;

    /**
     * Add book to user's library (reading, favorite, recommendation)
     * Frontend calls this when user taps "Start Reading", "Add to Favorites", etc.
     * POST /api/user-books
     */
    @PostMapping                                              // HTTP POST method for creating new resources
    public ResponseEntity<UserBookDto> addBookToLibrary(
            @RequestBody AddUserBookRequest request,          // JSON request body containing book details
            Authentication authentication) {                  // Spring Security provides authenticated user info

        // Extract user ID from JWT token (Spring Security handles token validation)
        UUID userId = UUID.fromString(authentication.getName());

        // Delegate business logic to service layer
        UserBookDto result = userBookService.addBookToUserLibrary(userId, request);

        // Return HTTP 200 OK with the created UserBook data
        return ResponseEntity.ok(result);
    }

    /**
     * Update reading status (READING, SAVED_FOR_LATER, COMPLETED)
     * Frontend calls this from the book summary page when user changes status
     * PUT /api/user-books/status
     */
    @PutMapping("/status")                                    // HTTP PUT for updating existing resources
    public ResponseEntity<UserBookDto> updateReadingStatus(
            @RequestBody UpdateUserBookStatusRequest request, // Request contains the new status
            Authentication authentication) {

        // Get authenticated user ID from security context
        UUID userId = UUID.fromString(authentication.getName());

        // Update the reading status through service layer
        UserBookDto result = userBookService.updateReadingStatus(userId, request);

        return ResponseEntity.ok(result);
    }

    /**
     * Toggle favorite status for a book
     * Frontend calls this when user taps the heart/favorite icon
     * PUT /api/user-books/favorite
     */
    @PutMapping("/favorite")
    public ResponseEntity<UserBookDto> toggleFavorite(
            @RequestBody ToggleFavoriteRequest request,       // Contains book ID and favorite boolean
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Handle favorite toggle logic (create relationship if needed)
        UserBookDto result = userBookService.toggleFavorite(userId, request);

        return ResponseEntity.ok(result);
    }

    /**
     * Toggle recommendation status for a book
     * Frontend calls this when user taps the recommend icon on their profile
     * PUT /api/user-books/recommendation
     */
    @PutMapping("/recommendation")
    public ResponseEntity<UserBookDto> toggleRecommendation(
            @RequestBody ToggleRecommendationRequest request, // Contains book ID and recommendation boolean
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Handle recommendation toggle logic (create relationship if needed)
        UserBookDto result = userBookService.toggleRecommendation(userId, request);

        return ResponseEntity.ok(result);
    }

    /**
     * Update reading progress as user advances through key points
     * Frontend calls this when user completes key points in book summary
     * PUT /api/user-books/progress
     */
    @PutMapping("/progress")
    public ResponseEntity<UserBookDto> updateProgress(
            @RequestBody UpdateBookProgressRequest request,   // Contains progress data (percentage, key points, etc.)
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Update reading progress and handle auto-completion logic
        UserBookDto result = userBookService.updateProgress(userId, request);

        return ResponseEntity.ok(result);
    }

    /**
     * Get all books in user's library
     * Frontend calls this to display the complete user library
     * GET /api/user-books
     */
    @GetMapping                                               // HTTP GET for retrieving data
    public ResponseEntity<List<UserBookDto>> getUserLibrary(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Retrieve all books associated with this user
        List<UserBookDto> library = userBookService.getUserLibrary(userId);

        return ResponseEntity.ok(library);
    }

    /**
     * Get books filtered by reading status
     * Frontend uses this for "Currently Reading", "Saved for Later", "Completed" sections
     * GET /api/user-books/status/{status}
     */
    @GetMapping("/status/{status}")                           // Path variable for dynamic status filtering
    public ResponseEntity<List<UserBookDto>> getBooksByStatus(
            @PathVariable String status,                      // URL path parameter (READING, SAVED_FOR_LATER, etc.)
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Filter books by the specified status
        List<UserBookDto> books = userBookService.getBooksByStatus(userId, status.toUpperCase());

        return ResponseEntity.ok(books);
    }

    /**
     * Get user's favorite books for their public profile
     * These are books the user wants to showcase as favorites to OTHER users
     * Powers the "Favorites" section on user's public profile page
     * GET /api/user-books/favorites
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<UserBookDto>> getFavoriteBooks(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Get books this user has marked as favorites to share with others
        List<UserBookDto> favorites = userBookService.getFavoriteBooks(userId);

        return ResponseEntity.ok(favorites);
    }

    /**
     * Get user's recommended books for their public profile
     * These are books the user is actively recommending to OTHER users
     * Powers the "Recommendations" section on user's public profile page
     * GET /api/user-books/recommendations
     */
    @GetMapping("/recommendations")
    public ResponseEntity<List<UserBookDto>> getRecommendedBooks(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Get books this user is recommending to others
        List<UserBookDto> recommended = userBookService.getRecommendedBooks(userId);

        return ResponseEntity.ok(recommended);
    }

    /**
     * Get currently reading books ordered by last read date
     * Powers the "Continue Reading" section on the home screen
     * GET /api/user-books/currently-reading
     */
    @GetMapping("/currently-reading")
    public ResponseEntity<List<UserBookDto>> getCurrentlyReading(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Get books user is actively reading, sorted by most recent activity
        List<UserBookDto> reading = userBookService.getCurrentlyReading(userId);

        return ResponseEntity.ok(reading);
    }

    /**
     * Get books with reading progress > 0 (for continue reading functionality)
     * Shows books where user has made progress but hasn't finished
     * GET /api/user-books/in-progress
     */
    @GetMapping("/in-progress")
    public ResponseEntity<List<UserBookDto>> getBooksInProgress(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Get partially read books for "Pick up where you left off" feature
        List<UserBookDto> inProgress = userBookService.getBooksInProgress(userId);

        return ResponseEntity.ok(inProgress);
    }

    /**
     * Get user's reading statistics for library dashboard
     * Powers reading stats and progress tracking for the library page only
     * GET /api/user-books/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<UserLibraryStatsDto> getUserLibraryStats(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Calculate and return user's library-specific statistics
        UserLibraryStatsDto stats = userBookService.getUserLibraryStats(userId);

        return ResponseEntity.ok(stats);
    }

    /**
     * Get user's profile statistics including favorites and recommendations
     * Powers the profile page statistics - separate from library stats
     * GET /api/user-books/profile-stats
     */
    @GetMapping("/profile-stats")
    public ResponseEntity<UserProfileStatsDto> getUserProfileStats(Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Calculate and return user's profile-specific statistics
        UserProfileStatsDto profileStats = userBookService.getUserProfileStats(userId);

        return ResponseEntity.ok(profileStats);
    }

    /**
     * Remove book from user's library
     * Frontend calls this when user wants to remove a book completely
     * Updated to use UUID bookId to match Book entity
     * DELETE /api/user-books/{bookId}
     */
    @DeleteMapping("/{bookId}")                               // HTTP DELETE for removing resources
    public ResponseEntity<Void> removeBookFromLibrary(
            @PathVariable Long bookId,                        // Book ID from URL path (UUID to match Book entity)
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Remove the user-book relationship completely (now using UUID type)
        userBookService.removeBookFromLibrary(userId, bookId);

        // Return HTTP 204 No Content (successful deletion with no response body)
        return ResponseEntity.noContent().build();
    }

    /**
     * Get another user's favorite books for viewing their public profile
     * Frontend calls this when viewing someone else's profile to see their favorites
     * GET /api/user-books/user/{userId}/favorites
     */
    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<List<UserBookDto>> getUserFavoriteBooks(
            @PathVariable UUID userId) {                      // Target user's ID from URL path

        // Get books that this specific user has marked as favorites to share publicly
        List<UserBookDto> favorites = userBookService.getFavoriteBooks(userId);

        return ResponseEntity.ok(favorites);
    }

    /**
     * Get another user's recommended books for viewing their public profile
     * Frontend calls this when viewing someone else's profile to see their recommendations
     * GET /api/user-books/user/{userId}/recommendations
     */
    @GetMapping("/user/{userId}/recommendations")
    public ResponseEntity<List<UserBookDto>> getUserRecommendedBooks(
            @PathVariable UUID userId) {                      // Target user's ID from URL path

        // Get books that this specific user is recommending to others
        List<UserBookDto> recommended = userBookService.getRecommendedBooks(userId);

        return ResponseEntity.ok(recommended);
    }

    /**
     * Get another user's profile statistics for viewing their public profile
     * Frontend calls this when viewing someone else's profile page
     * GET /api/user-books/user/{userId}/profile-stats
     */
    @GetMapping("/user/{userId}/profile-stats")
    public ResponseEntity<UserProfileStatsDto> getUserPublicProfileStats(
            @PathVariable UUID userId) {                      // Target user's ID from URL path

        // Get profile statistics for this specific user (public view)
        UserProfileStatsDto profileStats = userBookService.getUserProfileStats(userId);

        return ResponseEntity.ok(profileStats);
    }

    /**
     * Add reading time when user finishes a reading session
     * Frontend calls this when user closes key points page with calculated reading time
     * POST /api/user-books/reading-time
     */
    @PostMapping("/reading-time")
    public ResponseEntity<Void> addReadingTime(
            @RequestBody ReadingTimeRequest request,
            Authentication authentication) {

        UUID userId = UUID.fromString(authentication.getName());

        // Add the reading time to user's total milestone data
        userBookService.addReadingTime(userId, request);

        // Return HTTP 200 OK with no content
        return ResponseEntity.ok().build();
    }
}
