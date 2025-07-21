package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "milestones")
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int dailyStreak;
    private int highlights;
    private int booksCompleted;

    // Constructors
    public Milestone() {}
    public Milestone(User user, int dailyStreak, int highlights, int booksCompleted) {
        this.user = user;
        this.dailyStreak = dailyStreak;
        this.highlights = highlights;
        this.booksCompleted = booksCompleted;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public int getDailyStreak() { return dailyStreak; }
    public void setDailyStreak(int dailyStreak) { this.dailyStreak = dailyStreak; }
    public int getHighlights() { return highlights; }
    public void setHighlights(int highlights) { this.highlights = highlights; }
    public int getBooksCompleted() { return booksCompleted; }
    public void setBooksCompleted(int booksCompleted) { this.booksCompleted = booksCompleted; }
} 