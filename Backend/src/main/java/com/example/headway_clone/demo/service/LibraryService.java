package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.UserBook;
import com.example.headway_clone.demo.repository.UserBookRepository;
import com.example.headway_clone.demo.dto.UserBookDto;
import com.example.headway_clone.demo.dto.AddUserBookRequest;
import com.example.headway_clone.demo.dto.UpdateUserBookStatusRequest;
import com.example.headway_clone.demo.repository.UserRepository;
import com.example.headway_clone.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class LibraryService {
    @Autowired
    private UserBookRepository userBookRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserBookDto> getUserBooks(UUID userId, String status) {
        UserBook.Status bookStatus = UserBook.Status.valueOf(status.toUpperCase());
        List<UserBook> userBooks = userBookRepository.findByUserIdAndStatus(userId, bookStatus);
        return userBooks.stream().map(this::toDto).collect(Collectors.toList());
    }

    public long countUserBooksInProgress(UUID userId) {
        return userBookRepository.countByUserIdAndStatus(userId, UserBook.Status.READING);
    }

    @Transactional
    public UserBookDto addUserBook(UUID userId, AddUserBookRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");
        User user = userOpt.get();
        UserBook userBook = new UserBook();
        userBook.setUser(user);
        userBook.setBookTitle(request.getBookTitle());
        userBook.setAuthor(request.getAuthor());
        userBook.setCoverImageUrl(request.getCoverImageUrl());
        userBook.setStatus(UserBook.Status.valueOf(request.getStatus().toUpperCase()));
        if (userBook.getStatus() == UserBook.Status.READING) {
            userBook.setStartedAt(java.time.LocalDateTime.now());
        }
        UserBook saved = userBookRepository.save(userBook);
        return toDto(saved);
    }

    @Transactional
    public UserBookDto updateUserBookStatus(UUID userId, UUID userBookId, UpdateUserBookStatusRequest request) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new RuntimeException("UserBook not found"));
        if (!userBook.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        UserBook.Status newStatus = UserBook.Status.valueOf(request.getStatus().toUpperCase());
        userBook.setStatus(newStatus);
        if (newStatus == UserBook.Status.READING && userBook.getStartedAt() == null) {
            userBook.setStartedAt(java.time.LocalDateTime.now());
        }
        if (newStatus == UserBook.Status.COMPLETED) {
            userBook.setCompletedAt(java.time.LocalDateTime.now());
        }
        UserBook saved = userBookRepository.save(userBook);
        return toDto(saved);
    }

    @Transactional
    public void removeUserBook(UUID userId, UUID userBookId) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new RuntimeException("UserBook not found"));
        if (!userBook.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        userBookRepository.delete(userBook);
    }

    private UserBookDto toDto(UserBook userBook) {
        UserBookDto dto = new UserBookDto();
        dto.setId(userBook.getId());
        dto.setBookTitle(userBook.getBookTitle());
        dto.setAuthor(userBook.getAuthor());
        dto.setCoverImageUrl(userBook.getCoverImageUrl());
        dto.setStatus(userBook.getStatus().name());
        dto.setStartedAt(userBook.getStartedAt());
        dto.setCompletedAt(userBook.getCompletedAt());
        return dto;
    }
} 