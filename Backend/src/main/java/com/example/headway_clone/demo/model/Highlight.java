package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Highlight {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private UUID bookId;
    private String text;
    private Integer pageNumber;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public UUID getBookId() { return bookId; }
    public void setBookId(UUID bookId) { this.bookId = bookId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 