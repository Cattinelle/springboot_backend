package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * We are creating this FriendRequest entity to manage friendship connections between users.
 * Users can send friend requests which can be accepted, declined, or remain pending.
 * Once accepted, the status becomes FRIENDS.
 */
@Entity
@Table(name = "friendRequests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // User who sent the friend request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // User who received the friend request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    // Status of the friendship request
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    // Timestamp when request was created
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Timestamp when request was accepted (if applicable)
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    // Friendship status enum
    public enum FriendshipStatus {
        PENDING,    // Request sent but not yet responded to
        ACCEPTED,   // Request accepted - users are now friends
        DECLINED    // Request declined
    }

    // Helper method to check if current user is involved in this request
    public boolean isUserInvolved(User currentUser) {
        return sender.getId().equals(currentUser.getId()) ||
               receiver.getId().equals(currentUser.getId());
    }

    // Helper method to get the other user in the friendship
    public User getOtherUser(User currentUser) {
        if (sender.getId().equals(currentUser.getId())) {
            return receiver;
        } else {
            return sender;
        }
    }
}
