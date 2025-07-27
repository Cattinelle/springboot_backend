package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyPointDto {
    private Long id;
    private String title;
    private String summary;
    private List<String> insights;
    private Integer estimatedReadTimeMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
