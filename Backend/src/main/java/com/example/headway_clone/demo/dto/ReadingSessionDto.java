package com.example.headway_clone.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReadingSessionDto {
    private UUID id;
    private UUID userId;
    private UUID bookId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getBookId() { return bookId; }
    public void setBookId(UUID bookId) { this.bookId = bookId; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
} 