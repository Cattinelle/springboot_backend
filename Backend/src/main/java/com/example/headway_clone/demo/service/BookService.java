package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.Book;
import com.example.headway_clone.demo.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

// Service class responsible for business logic related to Book entities
@Service
public class BookService {
    // Injecting the BookRepository to interact with the database
    @Autowired
    private BookRepository bookRepository;

    // Retrieves all books from the repository (database)
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
} 