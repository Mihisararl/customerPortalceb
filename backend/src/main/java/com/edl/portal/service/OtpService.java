package com.edl.portal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import com.edl.portal.exception.ExternalApiException;
import com.edl.portal.exception.OtpException;
import com.edl.portal.util.ValidationUtil;
import com.edl.portal.util.MobileNumberUtil;

@Slf4j
@Service
public class OtpService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ValidationUtil validationUtil;

    @Autowired
    private MobileNumberUtil mobileNumberUtil;

    @Value("${external.api.otp.service.url}")
    private String otpServiceUrl;

    @Value("${external.api.otp.system.code}")
    private String systemCode;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String sendOtp(String mobileNo) {
        // Validate and normalize mobile number
        if (!validationUtil.isValidMobileNumber(mobileNo)) {
            throw new OtpException("Invalid mobile number format");
        }

        String normalizedMobileNo = mobileNumberUtil.normalizeMobileNumber(mobileNo);

        if (normalizedMobileNo.isEmpty()) {
            throw new OtpException("Registered mobile number is invalid for OTP delivery.");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = String.format("{\"mobileNo\": \"%s\", \"systemCode\": \"%s\"}", 
                    normalizedMobileNo, systemCode);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            String endpoint = otpServiceUrl + "/api/otp/sendOtp";
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                    throw new OtpException("OTP API endpoint was not found (404). Please verify the OTP service URL.");
                }
                throw new OtpException("Failed to send OTP. Please try again.");
            }

            // Parse response
            String responseBody = response.getBody();
            if (responseBody == null || responseBody.isEmpty()) {
                throw new OtpException("Invalid response from OTP service");
            }

            // Handle numeric response
            try {
                int result = Integer.parseInt(responseBody.trim());
                if (result == -1) {
                    throw new OtpException("OTP service rejected the request. Please try again later.");
                }
            } catch (NumberFormatException e) {
                // Response might be JSON
                try {
                    JsonNode jsonResponse = objectMapper.readTree(responseBody);
                    if (jsonResponse.has("success") && !jsonResponse.get("success").asBoolean()) {
                        throw new OtpException("OTP service rejected the request. Please try again later.");
                    }
                } catch (Exception jsonError) {
                    log.debug("Could not parse OTP service response as JSON", jsonError);
                }
            }

            log.info("OTP sent successfully to mobile: {}", mobileNumberUtil.maskMobileNumber(normalizedMobileNo));
            return mobileNumberUtil.maskMobileNumber(normalizedMobileNo);

        } catch (OtpException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error sending OTP to mobile: {}", mobileNo, e);
            throw new OtpException("Failed to send OTP. Please try again.");
        }
    }

    public boolean validateOtp(String mobileNo, String otp) {
        // Validate inputs
        if (!validationUtil.isValidMobileNumber(mobileNo)) {
            throw new OtpException("Invalid mobile number");
        }

        if (!validationUtil.isValidOtp(otp)) {
            throw new OtpException("Enter a valid OTP.");
        }

        String normalizedMobileNo = mobileNumberUtil.normalizeMobileNumber(mobileNo);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = String.format("{\"mobileNo\": \"%s\", \"otp\": %s}", 
                    normalizedMobileNo, Integer.parseInt(otp.trim()));
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            String endpoint = otpServiceUrl + "/api/otp/validateOtp";
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                    throw new OtpException("OTP validation API endpoint was not found (404)");
                }
                throw new OtpException("Failed to validate OTP. Please try again.");
            }

            // Parse response
            String responseBody = response.getBody();
            if (responseBody == null || responseBody.isEmpty()) {
                throw new OtpException("Invalid response from OTP service");
            }

            // Handle numeric response
            try {
                int result = Integer.parseInt(responseBody.trim());
                if (result == -1 || result == 0) {
                    throw new OtpException("Invalid OTP. Please try again.");
                }
                return true;
            } catch (NumberFormatException e) {
                // Try parsing as boolean string
                if ("true".equalsIgnoreCase(responseBody.trim())) {
                    return true;
                } else if ("false".equalsIgnoreCase(responseBody.trim())) {
                    throw new OtpException("Invalid OTP. Please try again.");
                }

                // Try parsing as JSON
                JsonNode jsonResponse = objectMapper.readTree(responseBody);
                if (jsonResponse.isBoolean()) {
                    return jsonResponse.asBoolean();
                }
                throw new OtpException("Invalid OTP. Please try again.");
            }

        } catch (OtpException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error validating OTP", e);
            throw new OtpException("Failed to validate OTP. Please try again.");
        }
    }
}
