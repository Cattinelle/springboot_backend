package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * We are creating this DTO for weekly reading goal information.
 * This tracks the user's weekly reading progress and goals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyGoalDto {

    private Integer goalBooks;
    private Integer progress;
    private Double progressPercentage;
    private LocalDate weekStartDate;
}
