package com.edl.portal.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edl.portal.model.ApiResponse;
import com.edl.portal.model.OtpRequest;
import com.edl.portal.model.OtpValidationRequest;
import com.edl.portal.service.OtpService;

@Slf4j
@RestController
@RequestMapping("/otp")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8095"}, allowCredentials = "true", maxAge = 3600)
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendOtp(@RequestBody OtpRequest request) {
        log.info("Received OTP send request for mobile");
        
        try {
            String maskedMobile = otpService.sendOtp(request.getMobileNo());
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(true)
                    .message("OTP sent successfully.")
                    .data(maskedMobile)
                    .build());
        } catch (Exception e) {
            log.error("Error sending OTP", e);
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .errorCode("OTP_SEND_ERROR")
                    .build());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateOtp(@RequestBody OtpValidationRequest request) {
        log.info("Received OTP validation request");
        
        try {
            boolean isValid = otpService.validateOtp(request.getMobileNo(), String.valueOf(request.getOtp()));
            
            return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                    .success(true)
                    .message("OTP validated successfully.")
                    .data(isValid)
                    .build());
        } catch (Exception e) {
            log.error("Error validating OTP", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Boolean>builder()
                    .success(false)
                    .message(e.getMessage())
                    .errorCode("OTP_VALIDATION_ERROR")
                    .build());
        }
    }
}
