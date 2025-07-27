package com.example.headway_clone.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    
    private boolean success;
    private String message;
    private Object data;
    
    // Constructors
    
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    // Removed duplicate constructor to fix compilation error
    
    // Static factory methods
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message);
    }
    
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }
    
    public static ApiResponse error(String message) {
        return new ApiResponse(false, message);
    }
}
