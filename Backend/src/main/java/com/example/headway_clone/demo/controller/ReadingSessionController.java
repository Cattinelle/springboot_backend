package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.ReadingSessionDto;
import com.example.headway_clone.demo.model.ReadingSession;
import com.example.headway_clone.demo.service.ReadingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reading-sessions")
public class ReadingSessionController {
    @Autowired
    private ReadingSessionService readingSessionService;

    @GetMapping
    public List<ReadingSessionDto> getAllSessions() {
        return readingSessionService.getAllSessions().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<ReadingSessionDto> getSessionsByUserId(@PathVariable UUID userId) {
        return readingSessionService.getSessionsByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ReadingSessionDto getSessionById(@PathVariable UUID id) {
        Optional<ReadingSession> session = readingSessionService.getSessionById(id);
        return session.map(this::toDto).orElse(null);
    }

    @PostMapping
    public ReadingSessionDto createSession(@RequestBody ReadingSessionDto dto) {
        ReadingSession session = toEntity(dto);
        return toDto(readingSessionService.saveSession(session));
    }

    @PutMapping("/{id}")
    public ReadingSessionDto updateSession(@PathVariable UUID id, @RequestBody ReadingSessionDto dto) {
        ReadingSession session = toEntity(dto);
        session.setId(id);
        return toDto(readingSessionService.saveSession(session));
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable UUID id) {
        readingSessionService.deleteSession(id);
    }

    private ReadingSessionDto toDto(ReadingSession session) {
        ReadingSessionDto dto = new ReadingSessionDto();
        dto.setId(session.getId());
        dto.setUserId(session.getUser() != null ? session.getUser().getId() : null);
        dto.setBookId(session.getBookId());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setDurationMinutes(session.getDurationMinutes());
        return dto;
    }

    private ReadingSession toEntity(ReadingSessionDto dto) {
        ReadingSession session = new ReadingSession();
        session.setId(dto.getId());
        // Set user if needed (requires UserRepository)
        session.setBookId(dto.getBookId());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setDurationMinutes(dto.getDurationMinutes());
        return session;
    }
} 