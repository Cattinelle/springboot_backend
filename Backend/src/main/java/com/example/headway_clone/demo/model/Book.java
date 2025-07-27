package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * We are creating this Book entity to represent books in our QuickTales catalog.
 * This entity contains only essential book information without subscription-related fields,
 * timestamps, or audio features as requested.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Book title

    @Column(nullable = false)
    private String author; // Book author

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Book category (Business, Self-Help, etc.)

    @Column(name = "cover")
    private String cover; // Cover image URL

    @Column(name="overview", length = 2000)
    private String overview; // Book summary/overview

    @Column(name = "about_author", length = 2000)
    private String aboutAuthor; // Information about the author

    // Book status in catalog (NEW_RELEASE, POPULAR, CLASSIC)
    @Enumerated(EnumType.STRING)
    private BookStatus status;

    // Relationships
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<KeyPoint> keyPoints; // Book's key points/chapters

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserBook> userBooks; // User-book relationships

    // Enum for book status
    public enum BookStatus {
        NEW_RELEASE, // Recently added books (triggers notifications)
        POPULAR,     // Popular books
        CLASSIC      // Classic/evergreen books
    }
}
