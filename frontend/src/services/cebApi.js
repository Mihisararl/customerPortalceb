/**
 * CEB Customer Portal - Frontend API Service
 * Updated to communicate with Spring Boot backend
 */

// Backend API Base URL - Change this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Store JWT token in localStorage for persistence
const TOKEN_KEY = 'ceb_auth_token';
const REFRESH_TOKEN_KEY = 'ceb_refresh_token';

/**
 * Store authentication token
 */
const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

/**
 * Retrieve authentication token
 */
const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Clear authentication token
 */
const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Get authorization headers with JWT token
 */
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Handle API errors
 */
const handleApiError = async (response, errorMessage) => {
    if (response.status === 401) {
        clearAuthToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    let errorData;
    try {
        errorData = await response.json();
    } catch {
        errorData = { message: errorMessage };
    }

    throw new Error(errorData.message || errorMessage);
};

/**
 * Normalize mobile number
 */
export const normalizeMobileNumber = (mobileNo) => {
    if (!mobileNo) {
        return '';
    }

    const digitsOnly = mobileNo.toString().replace(/\D/g, '');

    if (digitsOnly.length === 10) {
        return digitsOnly;
    }

    if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
        return digitsOnly.slice(0, 10);
    }

    if (digitsOnly.length === 12 && digitsOnly.startsWith('94')) {
        return `0${digitsOnly.slice(2)}`;
    }

    return '';
};

/**
 * Mask mobile number for display
 */
export const maskMobileNumber = (mobileNo) => {
    const normalized = normalizeMobileNumber(mobileNo);
    if (!normalized) {
        return '';
    }
    return `${normalized.slice(0, 3)}***${normalized.slice(-3)}`;
};

/**
 * Login with username and password
 */
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            await handleApiError(response, 'Login failed');
        }

        const result = await response.json();

        if (result.success && result.data?.token) {
            setAuthToken(result.data.token);
            return result.data;
        }

        throw new Error(result.message || 'Login failed');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Logout user
 */
export const logout = () => {
    clearAuthToken();
};

/**
 * Get mobile number by account number
 */
export const getMobileNumberByAccount = async (accountNumber) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/mobile-number`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ accountNumber })
        });

        if (!response.ok) {
            await handleApiError(response, 'Failed to fetch mobile number');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch mobile number');
        }

        const mobileNo = result.data;
        return {
            mobileNo,
            maskedMobileNo: maskMobileNumber(mobileNo)
        };
    } catch (error) {
        console.error('Error getting mobile number:', error);
        throw error;
    }
};

/**
 * Send login OTP
 */
export const sendLoginOtp = async (mobileNo, options = {}) => {
    try {
        const normalizedMobileNo = normalizeMobileNumber(mobileNo);

        if (!normalizedMobileNo) {
            throw new Error('Invalid mobile number');
        }

        const response = await fetch(`${API_BASE_URL}/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNo: normalizedMobileNo,
                accountNumber: options?.accountNumber || ''
            })
        });

        if (!response.ok) {
            await handleApiError(response, 'Failed to send OTP');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to send OTP');
        }

        return {
            mobileNo: normalizedMobileNo,
            maskedMobileNo: maskMobileNumber(normalizedMobileNo),
            ...result.data
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

/**
 * Validate login OTP
 */
export const validateLoginOtp = async ({ mobileNo, otp }) => {
    try {
        const normalizedMobileNo = normalizeMobileNumber(mobileNo);
        const normalizedOtp = otp?.toString().trim();

        if (!normalizedMobileNo) {
            throw new Error('Invalid mobile number');
        }

        if (!normalizedOtp || !/^\d{4,8}$/.test(normalizedOtp)) {
            throw new Error('Enter a valid OTP');
        }

        const response = await fetch(`${API_BASE_URL}/otp/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNo: normalizedMobileNo,
                otp: normalizedOtp
            })
        });

        if (!response.ok) {
            await handleApiError(response, 'Failed to validate OTP');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to validate OTP');
        }

        return true;
    } catch (error) {
        console.error('OTP validation error:', error);
        throw error;
    }
};

/**
 * Validate account number and get customer details
 */
export const validateAccountNumber = async (accountNumber) => {
    try {
        const accountNumberStr = accountNumber.toString().trim();

        if (!accountNumberStr || accountNumberStr.length !== 10 || !/^\d{10}$/.test(accountNumberStr)) {
            throw new Error('Account number must be exactly 10 digits');
        }

        const response = await fetch(`${API_BASE_URL}/customer/validate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ accountNumber: accountNumberStr })
        });

        if (!response.ok) {
            await handleApiError(response, 'Failed to validate account');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to retrieve customer details');
        }

        return result.data;
    } catch (error) {
        console.error('Account validation error:', error);
        throw error;
    }
};

/**
 * Validate account number format
 */
export const isValidAccountNumberFormat = (accountNumber) => {
    if (accountNumber == null) {
        return false;
    }
    const accountNumberStr = accountNumber.toString().trim();
    return accountNumberStr.length === 10 && /^\d{10}$/.test(accountNumberStr);
};

/**
 * Generate debug OTP (for testing)
 */
export const generateDebugOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};
