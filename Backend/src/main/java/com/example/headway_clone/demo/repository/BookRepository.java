package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Book;
import com.example.headway_clone.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Book entity operations.
 * Provides basic CRUD operations plus custom queries for book catalog features.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Find books by category
    List<Book> findByCategory(Category category);

    // Find books by category ID - Fixed type to Long since Category ID is Long
    List<Book> findByCategoryId(Long categoryId);

    // Find books by status (NEW_RELEASE, POPULAR, CLASSIC)
    List<Book> findByStatus(Book.BookStatus status);

    // Search books by title (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Search books by author (case-insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Search books by title OR author (for search functionality)
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Book> searchBooksByTitleOrAuthor(@Param("searchTerm") String searchTerm);

    // Get books by category and status
    List<Book> findByCategoryAndStatus(Category category, Book.BookStatus status);

    // Get books by category ID and status
    List<Book> findByCategoryIdAndStatus(Long categoryId, Book.BookStatus status);

    // Count books by category
    long countByCategory(Category category);

    // Count books by category ID
    long countByCategoryId(Long categoryId);
}