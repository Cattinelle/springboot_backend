package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.UserBookDto;
import com.example.headway_clone.demo.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.headway_clone.demo.security.UserPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.headway_clone.demo.dto.AddUserBookRequest;
import com.example.headway_clone.demo.dto.UpdateUserBookStatusRequest;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
    @Autowired
    private LibraryService libraryService;

    @GetMapping("/{status}")
    public ResponseEntity<List<UserBookDto>> getUserBooks(
            @PathVariable String status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<UserBookDto> books = libraryService.getUserBooks(userPrincipal.getId(), status);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/continue-reading/count")
    public ResponseEntity<Long> getContinueReadingCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        long count = libraryService.countUserBooksInProgress(userPrincipal.getId());
        return ResponseEntity.ok(count);
    }

    @PostMapping("")
    public ResponseEntity<UserBookDto> addUserBook(
            @RequestBody AddUserBookRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserBookDto dto = libraryService.addUserBook(userPrincipal.getId(), request);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{userBookId}/status")
    public ResponseEntity<UserBookDto> updateUserBookStatus(
            @PathVariable UUID userBookId,
            @RequestBody UpdateUserBookStatusRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserBookDto dto = libraryService.updateUserBookStatus(userPrincipal.getId(), userBookId, request);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{userBookId}")
    public ResponseEntity<Void> removeUserBook(
            @PathVariable UUID userBookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        libraryService.removeUserBook(userPrincipal.getId(), userBookId);
        return ResponseEntity.noContent().build();
    }
} 