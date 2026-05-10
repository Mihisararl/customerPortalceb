package com.ceb.portal.controller;

import com.ceb.portal.dto.ApiResponse;
import com.ceb.portal.dto.LoginRequest;
import com.ceb.portal.dto.LoginResponse;
import com.ceb.portal.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller - handles login requests
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty() ||
                loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .success(false)
                        .message("Username and password are required")
                        .build()
                );
            }

            LoginResponse response = authenticationService.login(loginRequest);

            return ResponseEntity.ok(
                ApiResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .data(response)
                    .build()
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.builder()
                    .success(false)
                    .message("Invalid credentials")
                    .errorCode("401")
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.builder()
                    .success(false)
                    .message("Login failed: " + e.getMessage())
                    .errorCode("500")
                    .build()
            );
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(
            ApiResponse.builder()
                .success(true)
                .message("Backend is running")
                .build()
        );
    }
}
