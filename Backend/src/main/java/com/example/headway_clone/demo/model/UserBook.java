package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_books")
public class UserBook {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bookTitle;
    private String author;
    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    private Status status; // READING, SAVED_FOR_LATER, COMPLETED

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public enum Status {
        READING, SAVED_FOR_LATER, COMPLETED
    }

    // Constructors
    public UserBook() {}
    public UserBook(User user, String bookTitle, String author, String coverImageUrl, Status status) {
        this.user = user;
        this.bookTitle = bookTitle;
        this.author = author;
        this.coverImageUrl = coverImageUrl;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
} 