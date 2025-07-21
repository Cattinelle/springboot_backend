package com.example.headway_clone.demo.dto;

public class AddUserBookRequest {
    private String bookTitle;
    private String author;
    private String coverImageUrl;
    private String status;

    // Getters and Setters
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 