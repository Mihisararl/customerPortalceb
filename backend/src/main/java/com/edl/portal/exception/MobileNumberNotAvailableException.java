package com.edl.portal.exception;

public class MobileNumberNotAvailableException extends RuntimeException {
    public MobileNumberNotAvailableException(String message) {
        super(message);
    }

    public MobileNumberNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
