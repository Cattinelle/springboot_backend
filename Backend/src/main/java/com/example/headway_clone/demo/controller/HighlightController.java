package com.example.headway_clone.demo.controller;

import com.example.headway_clone.demo.dto.HighlightDto;
import com.example.headway_clone.demo.model.Highlight;
import com.example.headway_clone.demo.service.HighlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/highlights")
public class HighlightController {
    @Autowired
    private HighlightService highlightService;

    @GetMapping
    public List<HighlightDto> getAllHighlights() {
        return highlightService.getAllHighlights().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<HighlightDto> getHighlightsByUserId(@PathVariable UUID userId) {
        return highlightService.getHighlightsByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public HighlightDto getHighlightById(@PathVariable UUID id) {
        Optional<Highlight> highlight = highlightService.getHighlightById(id);
        return highlight.map(this::toDto).orElse(null);
    }

    @PostMapping
    public HighlightDto createHighlight(@RequestBody HighlightDto dto) {
        Highlight highlight = toEntity(dto);
        return toDto(highlightService.saveHighlight(highlight));
    }

    @PutMapping("/{id}")
    public HighlightDto updateHighlight(@PathVariable UUID id, @RequestBody HighlightDto dto) {
        Highlight highlight = toEntity(dto);
        highlight.setId(id);
        return toDto(highlightService.saveHighlight(highlight));
    }

    @DeleteMapping("/{id}")
    public void deleteHighlight(@PathVariable UUID id) {
        highlightService.deleteHighlight(id);
    }

    private HighlightDto toDto(Highlight highlight) {
        HighlightDto dto = new HighlightDto();
        dto.setId(highlight.getId());
        dto.setUserId(highlight.getUser() != null ? highlight.getUser().getId() : null);
        dto.setBookId(highlight.getBookId());
        dto.setText(highlight.getText());
        dto.setPageNumber(highlight.getPageNumber());
        dto.setCreatedAt(highlight.getCreatedAt());
        return dto;
    }

    private Highlight toEntity(HighlightDto dto) {
        Highlight highlight = new Highlight();
        highlight.setId(dto.getId());
        // Set user if needed (requires UserRepository)
        highlight.setBookId(dto.getBookId());
        highlight.setText(dto.getText());
        highlight.setPageNumber(dto.getPageNumber());
        highlight.setCreatedAt(dto.getCreatedAt());
        return highlight;
    }
} 