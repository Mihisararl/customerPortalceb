/**
 * Backend API Service
 * Communicates with the secure Spring Boot backend
 */

const API_BASE_URL = '';
const BACKEND_API_URL = '/api';

/**
 * Parse API response
 */
const parseResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred. Please try again.';
        try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
        } catch {
            errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    try {
        return await response.json();
    } catch {
        throw new Error('Invalid response format from server');
    }
};

/**
 * Validate account number
 */
export const validateAccountNumber = async (accountNumber) => {
    if (!accountNumber || accountNumber.trim().length !== 10) {
        throw new Error('Account number must be exactly 10 digits');
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${BACKEND_API_URL}/customer/validate?accountNumber=${encodeURIComponent(accountNumber.trim())}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await parseResponse(response);

        if (!data.success) {
            throw new Error(data.message || 'Failed to validate account');
        }

        // Normalize mobile field names returned by backend
        const customer = { ...(data.data || {}) };
        customer.mobileNo =
            customer.mobileNo ||
            customer.phone ||
            (customer.telephoneNos && customer.telephoneNos[0]) ||
            customer.telephone ||
            '';
        customer.maskedMobileNo = maskMobileNumber(customer.mobileNo);

        return customer;
    } catch (error) {
        throw error instanceof Error ? error : new Error('Network error. Please check your connection.');
    }
};

/**
 * Get mobile number by account
 */
export const getMobileNumberByAccount = async (accountNumber) => {
    if (!accountNumber || accountNumber.trim().length !== 10) {
        throw new Error('Account number must be exactly 10 digits');
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${BACKEND_API_URL}/customer/mobile/${encodeURIComponent(accountNumber.trim())}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await parseResponse(response);

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch mobile number');
        }

        // Backend may return a plain string or an object containing phone/mobileNo
        let phone = '';
        if (typeof data.data === 'string') {
            phone = data.data;
        } else if (data.data) {
            phone = data.data.mobileNo || data.data.phone || (data.data.telephoneNos && data.data.telephoneNos[0]) || data.data.telephone || '';
        }

        return {
            mobileNo: phone,
            maskedMobileNo: maskMobileNumber(phone),
        };
    } catch (error) {
        throw error instanceof Error ? error : new Error('Unable to fetch registered mobile number. Please try again.');
    }
};

/**
 * Send login OTP
 */
export const sendLoginOtp = async (mobileNo) => {
    if (!mobileNo) {
        throw new Error('Mobile number is required');
    }

    try {
        const response = await fetch(`${API_BASE_URL}${BACKEND_API_URL}/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNo: mobileNo,
                systemCode: 'smc',
            }),
        });

        const data = await parseResponse(response);

        if (!data.success) {
            throw new Error(data.message || 'Failed to send OTP');
        }

        return {
            mobileNo: mobileNo,
            maskedMobileNo: data.data,
        };
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to send OTP. Please try again.');
    }
};

/**
 * Validate login OTP
 */
export const validateLoginOtp = async (mobileNo, otp) => {
    if (!mobileNo || !otp) {
        throw new Error('Mobile number and OTP are required');
    }

    if (!/^\d{4,8}$/.test(otp.toString().trim())) {
        throw new Error('Enter a valid OTP');
    }

    try {
        const response = await fetch(`${API_BASE_URL}${BACKEND_API_URL}/otp/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNo: mobileNo,
                otp: parseInt(otp),
            }),
        });

        const data = await parseResponse(response);

        if (!data.success) {
            throw new Error(data.message || 'Failed to validate OTP');
        }

        if (!data.data) {
            throw new Error('Invalid OTP. Please try again.');
        }

        return true;
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to validate OTP. Please try again.');
    }
};

/**
 * Normalize mobile number
 */
const normalizeMobileNumber = (value) => {
    if (!value) return '';
    const digitsOnly = value.toString().replace(/\D/g, '');
    if (digitsOnly.length === 10) return digitsOnly;
    if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
        return digitsOnly.slice(0, 10);
    }
    if (digitsOnly.length === 12 && digitsOnly.startsWith('94')) {
        return `0${digitsOnly.slice(2)}`;
    }
    return '';
};

/**
 * Mask mobile number
 */
export const maskMobileNumber = (mobileNo) => {
    const normalized = normalizeMobileNumber(mobileNo);
    if (!normalized) return '';
    return `${normalized.slice(0, 3)}***${normalized.slice(-3)}`;
};

/**
 * Validate account number format
 */
export const isValidAccountNumberFormat = (accountNumber) => {
    const accountNumberStr = accountNumber.toString().trim();
    return accountNumberStr.length === 10 && /^\d{10}$/.test(accountNumberStr);
};
