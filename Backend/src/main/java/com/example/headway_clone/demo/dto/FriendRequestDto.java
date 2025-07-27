package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.headway_clone.demo.model.FriendRequest.FriendshipStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this DTO for friend request information.
 * This shows friend request details including sender/receiver and status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequestDto {

    private UUID id;
    private UserBasicDto otherUser; // Either sender or receiver depending on context
    private FriendshipStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private String requestType;
}
