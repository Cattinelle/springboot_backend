package com.example.headway_clone.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.headway_clone.demo.model.FriendRequest.FriendshipStatus;

/**
 * We are creating this DTO to handle friend request responses.
 * Users can accept or decline friend requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespondToFriendRequestDto {

    private FriendshipStatus action; // ACCEPTED or DECLINED
}
