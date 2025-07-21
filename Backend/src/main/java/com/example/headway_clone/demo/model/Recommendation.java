package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bookTitle;
    private String author;
    private String note;

    // Constructors
    public Recommendation() {}
    public Recommendation(User user, String bookTitle, String author, String note) {
        this.user = user;
        this.bookTitle = bookTitle;
        this.author = author;
        this.note = note;
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
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
} 