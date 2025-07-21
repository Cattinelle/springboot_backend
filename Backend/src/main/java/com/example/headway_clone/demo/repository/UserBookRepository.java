package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserBookRepository extends JpaRepository<UserBook, UUID> {
    List<UserBook> findByUserIdAndStatus(UUID userId, UserBook.Status status);
    long countByUserIdAndStatus(UUID userId, UserBook.Status status);
} 