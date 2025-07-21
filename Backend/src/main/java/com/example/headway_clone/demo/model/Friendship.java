package com.example.headway_clone.demo.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "friendships")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friend;

    // Constructors
    public Friendship() {}
    public Friendship(User user, User friend) {
        this.user = user;
        this.friend = friend;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public User getFriend() { return friend; }
    public void setFriend(User friend) { this.friend = friend; }
} 