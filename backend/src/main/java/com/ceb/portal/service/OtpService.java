package com.ceb.portal.service;

import com.ceb.portal.dto.OtpResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OTP Service - manages OTP generation, sending, and validation
 * In production, integrate with actual SMS gateway
 */
@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    @Value("${external.api.base-url}")
    private String externalApiBaseUrl;

    // In-memory OTP storage (replace with database in production)
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        long timestamp;
        int attempts;

        OtpData(String otp) {
            this.otp = otp;
            this.timestamp = System.currentTimeMillis();
            this.attempts = 0;
        }

        boolean isExpired() {
            // OTP valid for 10 minutes
            return System.currentTimeMillis() - timestamp > 10 * 60 * 1000;
        }
    }

    /**
     * Generate random 6-digit OTP
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Normalize mobile number
     */
    public String normalizeMobileNumber(String mobileNo) {
        if (mobileNo == null || mobileNo.isEmpty()) {
            return "";
        }

        String digitsOnly = mobileNo.replaceAll("\\D", "");

        if (digitsOnly.length() == 10) {
            return digitsOnly;
        }

        if (digitsOnly.length() == 11 && digitsOnly.startsWith("0")) {
            return digitsOnly.substring(0, 10);
        }

        if (digitsOnly.length() == 12 && digitsOnly.startsWith("94")) {
            return "0" + digitsOnly.substring(2);
        }

        return "";
    }

    /**
     * Mask mobile number for display
     */
    public String maskMobileNumber(String mobileNo) {
        String normalized = normalizeMobileNumber(mobileNo);
        if (normalized.isEmpty()) {
            return "";
        }
        return normalized.substring(0, 3) + "***" + normalized.substring(7);
    }

    /**
     * Send OTP to mobile number
     */
    public OtpResponse sendOtp(String mobileNo, String accountNumber) throws Exception {
        String normalizedMobileNo = normalizeMobileNumber(mobileNo);

        if (normalizedMobileNo.isEmpty()) {
            throw new Exception("Invalid mobile number format");
        }

        String otp = generateOtp();
        otpStore.put(normalizedMobileNo, new OtpData(otp));

        logger.info("OTP generated for account: {}, mobile: {}, OTP: {}", accountNumber, normalizedMobileNo, otp);

        // In production, integrate with SMS gateway here
        // For now, logging to console for testing
        System.out.println("\n========================================");
        System.out.println("OTP for " + maskMobileNumber(normalizedMobileNo) + ": " + otp);
        System.out.println("Account: " + accountNumber);
        System.out.println("========================================\n");

        return OtpResponse.builder()
                .success(true)
                .message("OTP sent successfully")
                .mobileNo(normalizedMobileNo)
                .maskedMobileNo(maskMobileNumber(normalizedMobileNo))
                .build();
    }

    /**
     * Validate OTP
     */
    public boolean validateOtp(String mobileNo, String otp) throws Exception {
        String normalizedMobileNo = normalizeMobileNumber(mobileNo);

        if (!otpStore.containsKey(normalizedMobileNo)) {
            throw new Exception("No OTP found for this mobile number");
        }

        OtpData otpData = otpStore.get(normalizedMobileNo);

        if (otpData.isExpired()) {
            otpStore.remove(normalizedMobileNo);
            throw new Exception("OTP has expired");
        }

        otpData.attempts++;

        if (otpData.attempts > 3) {
            otpStore.remove(normalizedMobileNo);
            throw new Exception("Maximum OTP validation attempts exceeded");
        }

        if (!otpData.otp.equals(otp)) {
            throw new Exception("Invalid OTP");
        }

        otpStore.remove(normalizedMobileNo);
        logger.info("OTP validated successfully for mobile: {}", normalizedMobileNo);

        return true;
    }
}
