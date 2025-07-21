package com.example.headway_clone.demo.service;

import com.example.headway_clone.demo.model.Highlight;
import com.example.headway_clone.demo.repository.HighlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HighlightService {
    @Autowired
    private HighlightRepository highlightRepository;

    public List<Highlight> getAllHighlights() {
        return highlightRepository.findAll();
    }

    public Optional<Highlight> getHighlightById(UUID id) {
        return highlightRepository.findById(id);
    }

    public List<Highlight> getHighlightsByUserId(UUID userId) {
        return highlightRepository.findByUserId(userId);
    }

    public Highlight saveHighlight(Highlight highlight) {
        return highlightRepository.save(highlight);
    }

    public void deleteHighlight(UUID id) {
        highlightRepository.deleteById(id);
    }
} 