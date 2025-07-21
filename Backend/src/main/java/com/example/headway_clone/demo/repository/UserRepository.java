package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") UUID userId, @Param("loginTime") LocalDateTime loginTime);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
}
