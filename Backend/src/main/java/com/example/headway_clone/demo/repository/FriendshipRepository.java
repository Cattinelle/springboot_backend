package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Friendship;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    List<Friendship> findByUser(User user);
    List<Friendship> findByFriend(User friend);
} 