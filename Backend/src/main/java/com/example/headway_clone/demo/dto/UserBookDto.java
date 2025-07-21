package com.example.headway_clone.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserBookDto {
    private UUID id;
    private String bookTitle;
    private String author;
    private String coverImageUrl;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
} 