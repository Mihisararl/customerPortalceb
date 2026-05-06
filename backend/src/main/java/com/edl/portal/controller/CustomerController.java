package com.edl.portal.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edl.portal.model.ApiResponse;
import com.edl.portal.model.CustomerData;
import com.edl.portal.service.CustomerService;

@Slf4j
@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8095"}, allowCredentials = "true", maxAge = 3600)
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CustomerData>> validateAccount(@RequestParam String accountNumber) {
        log.info("Received validate account request for account: {}", accountNumber);
        
        try {
            CustomerData customerData = customerService.validateAccountNumber(accountNumber);
            
            return ResponseEntity.ok(ApiResponse.<CustomerData>builder()
                    .success(true)
                    .message("Customer details retrieved successfully.")
                    .data(customerData)
                    .build());
        } catch (Exception e) {
            log.error("Error validating account: {}", accountNumber, e);
            return ResponseEntity.badRequest().body(ApiResponse.<CustomerData>builder()
                    .success(false)
                    .message(e.getMessage())
                    .errorCode("VALIDATION_ERROR")
                    .build());
        }
    }

    @GetMapping("/mobile/{accountNumber}")
    public ResponseEntity<ApiResponse<String>> getMobileNumber(@PathVariable String accountNumber) {
        log.info("Received get mobile number request for account: {}", accountNumber);
        
        try {
            String mobileNo = customerService.getMobileNumberByAccount(accountNumber);
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(true)
                    .message("Mobile number retrieved successfully.")
                    .data(mobileNo)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching mobile number for account: {}", accountNumber, e);
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .errorCode("MOBILE_ERROR")
                    .build());
        }
    }
}
