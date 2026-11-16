package com.travelplanner.common.dto;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
    int status,
    String message,
    String error,
    String path,
    Map<String, String> validationErrors,
    Instant timestamp
) {
    public ErrorResponse(int status, String message, String error, String path) {
        this(status, message, error, path, null, Instant.now());
    }

    public ErrorResponse(int status, String message, String error, String path, Map<String, String> validationErrors) {
        this(status, message, error, path, validationErrors, Instant.now());
    }
}
