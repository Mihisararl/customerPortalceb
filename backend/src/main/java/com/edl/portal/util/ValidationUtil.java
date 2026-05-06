package com.edl.portal.util;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

@Component
public class ValidationUtil {

    private static final Pattern ACCOUNT_NUMBER_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern OTP_PATTERN = Pattern.compile("^\\d{4,8}$");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^\\d{10,12}$");

    public boolean isValidAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return false;
        }
        return ACCOUNT_NUMBER_PATTERN.matcher(accountNumber.trim()).matches();
    }

    public boolean isValidOtp(String otp) {
        if (otp == null || otp.trim().isEmpty()) {
            return false;
        }
        return OTP_PATTERN.matcher(otp.trim()).matches();
    }

    public boolean isValidMobileNumber(String mobile) {
        if (mobile == null || mobile.trim().isEmpty()) {
            return false;
        }
        return MOBILE_PATTERN.matcher(mobile.replaceAll("\\D", "")).matches();
    }
}
