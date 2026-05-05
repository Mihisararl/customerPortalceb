package com.edl.portal.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.edl.portal.model.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidAccountNumberException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidAccountNumber(InvalidAccountNumberException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .errorCode("INVALID_ACCOUNT")
                .build());
    }

    @ExceptionHandler(MobileNumberNotAvailableException.class)
    public ResponseEntity<ApiResponse<Object>> handleMobileNumberNotAvailable(MobileNumberNotAvailableException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .errorCode("MOBILE_NOT_AVAILABLE")
                .build());
    }

    @ExceptionHandler(OtpException.class)
    public ResponseEntity<ApiResponse<Object>> handleOtpException(OtpException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .errorCode("OTP_ERROR")
                .build());
    }

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleExternalApiException(ExternalApiException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .errorCode("EXTERNAL_API_ERROR")
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex, WebRequest request) {
        return ResponseEntity.status(500).body(ApiResponse.builder()
                .success(false)
                .message("An unexpected error occurred. Please try again later.")
                .errorCode("INTERNAL_ERROR")
                .build());
    }
}
