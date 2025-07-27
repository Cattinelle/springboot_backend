package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this DTO to handle weekly reading goal requests.
 * Users can set how many books they want to read per week.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetWeeklyGoalRequest {

    private Integer goalBooks;
}
