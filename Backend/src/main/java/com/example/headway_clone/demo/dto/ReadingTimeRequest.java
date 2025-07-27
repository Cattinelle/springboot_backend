package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * We are creating this ReadingTimeRequest DTO to track reading sessions.
 * Frontend sends this when user starts/stops reading key points to calculate total reading time.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingTimeRequest {
    // Book ID being read
    private Long bookId;

    // Minutes spent reading this session (calculated by frontend)
    // Frontend calculates: endTime - startTime when user closes key points page
    private Integer minutesSpent;
}
