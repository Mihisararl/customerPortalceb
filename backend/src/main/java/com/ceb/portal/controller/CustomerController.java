package com.ceb.portal.controller;

import com.ceb.portal.dto.ApiResponse;
import com.ceb.portal.dto.AccountValidationRequest;
import com.ceb.portal.dto.CustomerDetailsDto;
import com.ceb.portal.dto.MobileNumberRequest;
import com.ceb.portal.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Customer Controller - handles customer-related requests
 */
@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * Validate account number and get customer details
     */
    @PostMapping("/validate")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> validateAccount(@RequestBody AccountValidationRequest request) {
        try {
            if (request.getAccountNumber() == null || request.getAccountNumber().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .success(false)
                        .message("Account number is required")
                        .build()
                );
            }

            CustomerDetailsDto customerDetails = customerService.validateAccountNumber(
                request.getAccountNumber()
            );

            return ResponseEntity.ok(
                ApiResponse.builder()
                    .success(true)
                    .message("Customer details retrieved successfully")
                    .data(customerDetails)
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
     * Get mobile number by account number
     */
    @PostMapping("/mobile-number")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> getMobileNumber(@RequestBody MobileNumberRequest request) {
        try {
            if (request.getAccountNumber() == null || request.getAccountNumber().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .success(false)
                        .message("Account number is required")
                        .build()
                );
            }

            String mobileNumber = customerService.getMobileNumberByAccount(
                request.getAccountNumber()
            );

            return ResponseEntity.ok(
                ApiResponse.builder()
                    .success(true)
                    .message("Mobile number retrieved successfully")
                    .data(mobileNumber)
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
     * Check account number format validity
     */
    @GetMapping("/validate-format/{accountNumber}")
    public ResponseEntity<?> validateFormat(@PathVariable String accountNumber) {
        try {
            boolean isValid = customerService.isValidAccountNumberFormat(accountNumber);
            
            return ResponseEntity.ok(
                ApiResponse.builder()
                    .success(isValid)
                    .message(isValid ? "Account number format is valid" : "Invalid account number format")
                    .data(isValid)
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
}
