package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.FavoriteBook;
import com.example.headway_clone.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteBookRepository extends JpaRepository<FavoriteBook, UUID> {
    List<FavoriteBook> findByUser(User user);
} 