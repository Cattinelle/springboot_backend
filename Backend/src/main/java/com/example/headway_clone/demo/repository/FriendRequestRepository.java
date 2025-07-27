package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for FriendRequest entity operations.
 * Handles friendship management including pending, accepted, and declined requests.
 */
@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, UUID> {

    // Find friend requests by sender
    List<FriendRequest> findBySenderId(UUID senderId);

    // Find friend requests by receiver
    List<FriendRequest> findByReceiverId(UUID receiverId);

    // Find friend requests by status
    List<FriendRequest> findByStatus(FriendRequest.FriendshipStatus status);

    // Find pending requests sent by user
    List<FriendRequest> findBySenderIdAndStatus(UUID senderId, FriendRequest.FriendshipStatus status);

    // Find pending requests received by user
    List<FriendRequest> findByReceiverIdAndStatus(UUID receiverId, FriendRequest.FriendshipStatus status);

    // Check if friendship exists between two users (any direction, any status)
    @Query("SELECT fr FROM FriendRequest fr WHERE " +
           "(fr.sender.id = :userId1 AND fr.receiver.id = :userId2) OR " +
           "(fr.sender.id = :userId2 AND fr.receiver.id = :userId1)")
    Optional<FriendRequest> findExistingFriendRequest(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);

    // Find accepted friendships for a user (both sent and received)
    @Query("SELECT fr FROM FriendRequest fr WHERE " +
           "(fr.sender.id = :userId OR fr.receiver.id = :userId) AND " +
           "fr.status = 'ACCEPTED'")
    List<FriendRequest> findAcceptedFriendships(@Param("userId") UUID userId);

    // Find pending friend requests for a user (both sent and received)
    @Query("SELECT fr FROM FriendRequest fr WHERE " +
           "(fr.sender.id = :userId OR fr.receiver.id = :userId) AND " +
           "fr.status = 'PENDING'")
    List<FriendRequest> findPendingFriendRequests(@Param("userId") UUID userId);

    // Count friend requests by status for a user
    @Query("SELECT COUNT(fr) FROM FriendRequest fr WHERE " +
           "fr.receiver.id = :userId AND fr.status = :status")
    long countReceivedRequestsByStatus(@Param("userId") UUID userId, @Param("status") FriendRequest.FriendshipStatus status);

    // Count total friends (accepted requests) for a user
    @Query("SELECT COUNT(fr) FROM FriendRequest fr WHERE " +
           "(fr.sender.id = :userId OR fr.receiver.id = :userId) AND " +
           "fr.status = 'ACCEPTED'")
    long countFriends(@Param("userId") UUID userId);

    // Find mutual friends between two users
    @Query("SELECT DISTINCT fr1 FROM FriendRequest fr1, FriendRequest fr2 WHERE " +
           "fr1.status = 'ACCEPTED' AND fr2.status = 'ACCEPTED' AND " +
           "((fr1.sender.id = :userId1 AND fr2.sender.id = :userId2) OR " +
           " (fr1.sender.id = :userId1 AND fr2.receiver.id = :userId2) OR " +
           " (fr1.receiver.id = :userId1 AND fr2.sender.id = :userId2) OR " +
           " (fr1.receiver.id = :userId1 AND fr2.receiver.id = :userId2)) AND " +
           "((fr1.receiver.id = fr2.receiver.id AND fr1.receiver.id != :userId1 AND fr1.receiver.id != :userId2) OR " +
           " (fr1.sender.id = fr2.sender.id AND fr1.sender.id != :userId1 AND fr1.sender.id != :userId2))")
    List<FriendRequest> findMutualFriends(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);
}
