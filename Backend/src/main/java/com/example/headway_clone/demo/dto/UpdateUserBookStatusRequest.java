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
public class UpdateUserBookStatusRequest {
    private UUID userBookId;
    private String status; // READING, SAVED_FOR_LATER, COMPLETED, NOT_STARTED
}
