package com.ceb.portal.controller;

import com.ceb.portal.dto.ApiResponse;
import com.ceb.portal.dto.OtpSendRequest;
import com.ceb.portal.dto.OtpValidationRequest;
import com.ceb.portal.dto.OtpResponse;
import com.ceb.portal.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * OTP Controller - handles OTP operations
 */
@RestController
@RequestMapping("/otp")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OtpController {

    @Autowired
    private OtpService otpService;

    /**
     * Send OTP to mobile number
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpSendRequest request) {
        try {
            if (request.getMobileNo() == null || request.getMobileNo().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .success(false)
                        .message("Mobile number is required")
                        .build()
                );
            }

            OtpResponse response = otpService.sendOtp(request.getMobileNo(), 
                                                     request.getAccountNumber());

            return ResponseEntity.ok(
                ApiResponse.builder()
                    .success(true)
                    .message("OTP sent successfully")
                    .data(response)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    /**
     * Validate OTP
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateOtp(@RequestBody OtpValidationRequest request) {
        try {
            if (request.getMobileNo() == null || request.getMobileNo().isEmpty() ||
                request.getOtp() == null || request.getOtp().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .success(false)
                        .message("Mobile number and OTP are required")
                        .build()
                );
            }

            boolean isValid = otpService.validateOtp(request.getMobileNo(), request.getOtp());

            if (isValid) {
                return ResponseEntity.ok(
                    ApiResponse.builder()
                        .success(true)
                        .message("OTP validated successfully")
                        .build()
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiResponse.builder()
                .success(false)
                .message("OTP validation failed")
                .build()
        );
    }
}
