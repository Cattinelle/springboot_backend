package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookFilterRequest {
    private String category;
    private String status; // NEW_RELEASE, POPULAR, CLASSIC, FEATURED
    private String author;
    private String searchQuery;
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "title"; // title, author, createdAt
    private String sortDirection = "ASC"; // ASC, DESC
}
