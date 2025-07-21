package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.ReadingSession;
import com.example.headway_clone.demo.repository.ReadingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReadingSessionService {
    @Autowired
    private ReadingSessionRepository readingSessionRepository;

    public List<ReadingSession> getAllSessions() {
        return readingSessionRepository.findAll();
    }

    public Optional<ReadingSession> getSessionById(UUID id) {
        return readingSessionRepository.findById(id);
    }

    public List<ReadingSession> getSessionsByUserId(UUID userId) {
        return readingSessionRepository.findByUserId(userId);
    }

    public ReadingSession saveSession(ReadingSession session) {
        return readingSessionRepository.save(session);
    }

    public void deleteSession(UUID id) {
        readingSessionRepository.deleteById(id);
    }
} 