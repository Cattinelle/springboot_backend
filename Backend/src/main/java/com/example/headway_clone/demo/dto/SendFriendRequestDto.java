package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * We are creating this SendFriendRequestDto to handle friend request creation.
 * Frontend sends this when user wants to send a friend request to another user.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendFriendRequestDto {
    // ID of the user to send friend request to
    private UUID targetUserId;
}
