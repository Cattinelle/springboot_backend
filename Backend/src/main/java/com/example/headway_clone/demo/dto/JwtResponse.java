package com.example.headway_clone.demo.dto;

import com.example.headway_clone.demo.model.SubscriptionType;
import java.util.UUID;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private SubscriptionType subscriptionType;
    
    // Constructors
    public JwtResponse() {}
    
    public JwtResponse(String token, UUID id, String email, String firstName, 
                      String lastName, String avatarUrl, SubscriptionType subscriptionType) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
        this.subscriptionType = subscriptionType;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public SubscriptionType getSubscriptionType() { return subscriptionType; }
    public void setSubscriptionType(SubscriptionType subscriptionType) { this.subscriptionType = subscriptionType; }
}
