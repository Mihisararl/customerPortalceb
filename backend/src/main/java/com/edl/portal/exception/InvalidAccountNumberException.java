package com.edl.portal.exception;

public class InvalidAccountNumberException extends RuntimeException {
    public InvalidAccountNumberException(String message) {
        super(message);
    }

    public InvalidAccountNumberException(String message, Throwable cause) {
        super(message, cause);
    }
}
