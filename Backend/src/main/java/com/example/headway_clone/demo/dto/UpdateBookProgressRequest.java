package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We are creating this UpdateBookProgressRequest DTO to handle reading progress updates
 * from the frontend when users advance through key points in a book summary.
 * Updated to use Long bookId and currentKeyPointId to match the entity primary key types.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookProgressRequest {
    // Book ID using Long to match Book entity's primary key
    private Long bookId;

    // Long ID of the current key point the user is reading
    // This helps us know exactly where the user stopped reading
    private Long currentKeyPointId;

    // Number of key points the user has completed reading
    // Used for milestone tracking and progress calculations
    private Integer completedKeyPoints;

    // Overall progress percentage (0-100)
    // Frontend uses this for progress bars and completion indicators
    private Integer progressPercentage;
}
