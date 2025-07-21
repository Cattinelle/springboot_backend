package com.example.headway_clone.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class HighlightDto {
    private UUID id;
    private UUID userId;
    private UUID bookId;
    private String text;
    private Integer pageNumber;
    private LocalDateTime createdAt;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getBookId() { return bookId; }
    public void setBookId(UUID bookId) { this.bookId = bookId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 