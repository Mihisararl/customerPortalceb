package com.edl.portal.util;

import org.springframework.stereotype.Component;

@Component
public class MobileNumberUtil {

    public String normalizeMobileNumber(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }

        String digitsOnly = value.replaceAll("\\D", "");

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

    public String maskMobileNumber(String mobileNo) {
        String normalized = normalizeMobileNumber(mobileNo);
        if (normalized.isEmpty()) {
            return "";
        }
        return normalized.substring(0, 3) + "***" + normalized.substring(normalized.length() - 3);
    }

    public String generateOtp() {
        int otp = 100000 + (int)(Math.random() * 900000);
        return String.valueOf(otp);
    }
}
