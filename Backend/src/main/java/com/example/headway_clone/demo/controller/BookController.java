package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.model.Book;
import com.example.headway_clone.demo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// This controller handles HTTP requests related to Book resources.
@RestController
@RequestMapping("/api/books") // Base URL for all book-related endpoints
public class BookController {
    // Injecting the BookService to handle business logic
    @Autowired
    private BookService bookService;

    // Handles GET requests to /api/books
    // Returns a list of all books in the system
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
} 