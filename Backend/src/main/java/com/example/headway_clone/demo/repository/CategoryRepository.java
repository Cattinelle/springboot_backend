package com.example.headway_clone.demo.repository;

import com.example.headway_clone.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // You can add custom query methods here if needed
} 