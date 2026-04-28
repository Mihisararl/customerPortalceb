/**
 * CEB Customer Detail Service
 * API for validating and retrieving CEB customer account information
 */

// Use relative URL to go through Vite proxy (configured in vite.config.js)
// The proxy forwards /api requests to http://10.128.1.59:6001
const API_BASE_URL = '';
const API_ENDPOINT = '/api/customer/CEBCustomer_CurrantBalance';
const API_LOGIN_ENDPOINT = '/api/Auth/login';
const ACCOUNT_MOBILE_LOOKUP_ENDPOINT = '/customer-details-api/api/Customerdetails/by-account';
const OTP_SEND_ENDPOINT = '/shared-api/api/otp/sendOtp';
const OTP_VALIDATE_ENDPOINT = '/shared-api/api/otp/validateOtp';
const OTP_DEBUG_LOG_ENDPOINT = '/dev/otp-log';
const OTP_SYSTEM_CODE = 'smc';

// API Authentication Configuration
const API_CREDENTIALS = {
    username: 'CEBkiosk',
    password: 'kiosk#$CEB'
};

// Store JWT token in memory
let cachedToken = null;

const parseOtpApiResponse = async (response) => {
    const rawText = await response.text();

    if (!rawText) {
        return null;
    }

    try {
        return JSON.parse(rawText);
    } catch {
        const numericValue = Number(rawText);
        return Number.isNaN(numericValue) ? rawText : numericValue;
    }
};

const normalizeMobileNumber = (value) => {
    if (!value) {
        return '';
    }

    const digitsOnly = value.toString().replace(/\D/g, '');

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

export const maskMobileNumber = (mobileNo) => {
    const normalized = normalizeMobileNumber(mobileNo);
    if (!normalized) {
        return '';
    }

    return `${normalized.slice(0, 3)}***${normalized.slice(-3)}`;
};

const extractMobileNumberFromLookupResponse = (data) => {
    if (!data) {
        return '';
    }

    const firstCustomer = Array.isArray(data?.data) && data.data.length > 0
        ? data.data[0]
        : null;

    const firstTelephoneNo = Array.isArray(firstCustomer?.telephoneNos) && firstCustomer.telephoneNos.length > 0
        ? firstCustomer.telephoneNos[0]
        : null;

    const candidates = [
        data.mobileNo,
        data.mobileNumber,
        data.phone,
        data.telephone,
        data.contactNo,
        data.customerMobileNo,
        data.customerMobileNumber,
        data?.data?.mobileNo,
        data?.data?.mobileNumber,
        data?.customer?.mobileNo,
        data?.customer?.mobileNumber,
        firstCustomer?.telephoneNo,
        firstCustomer?.telephone,
        firstCustomer?.mobileNo,
        firstCustomer?.mobileNumber,
        firstTelephoneNo,
    ];

    const validMobile = candidates
        .map((value) => normalizeMobileNumber(value))
        .find((value) => Boolean(value));

    return validMobile || '';
};

const logOtpForTesting = async ({ accountNumber, mobileNo, otp }) => {
    try {
        await fetch(`${API_BASE_URL}${OTP_DEBUG_LOG_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountNumber,
                mobileNo,
                otp,
            }),
        });
    } catch (error) {
        console.warn('OTP debug log endpoint is not available:', error);
    }
};

export const generateDebugOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const getMobileNumberByAccount = async (accountNumber) => {
    const accountNumberStr = accountNumber?.toString().trim();

    if (!accountNumberStr || !/^\d{10}$/.test(accountNumberStr)) {
        throw new Error('Account number must be exactly 10 digits');
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${ACCOUNT_MOBILE_LOOKUP_ENDPOINT}?accountNumber=${encodeURIComponent(accountNumberStr)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch {
        throw new Error('Unable to fetch registered mobile number. Please try again.');
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No registered mobile number found for this account.');
        }

        throw new Error('Failed to fetch registered mobile number.');
    }

    const mobileNo = extractMobileNumberFromLookupResponse(data);

    if (!mobileNo) {
        throw new Error('Registered mobile number is not available for this account.');
    }

    return {
        mobileNo,
        maskedMobileNo: maskMobileNumber(mobileNo),
        rawResponse: data,
    };
};

export const sendLoginOtp = async (mobileNo, options = {}) => {
    const normalizedMobileNo = normalizeMobileNumber(mobileNo);
    const debugOtp = options?.debugOtp?.toString().trim();
    const accountNumber = options?.accountNumber?.toString().trim();

    if (!normalizedMobileNo) {
        throw new Error('Registered mobile number is invalid for OTP delivery.');
    }

    const response = await fetch(`${API_BASE_URL}${OTP_SEND_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobileNo: normalizedMobileNo,
            systemCode: OTP_SYSTEM_CODE,
        }),
    });

    const result = await parseOtpApiResponse(response);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('OTP API endpoint was not found (404). Please verify the OTP service URL with the backend team.');
        }

        throw new Error('Failed to send OTP. Please try again.');
    }

    if (result === -1) {
        throw new Error('OTP service rejected the request. Please try again later.');
    }

    if (debugOtp) {
        // Temporary debug mode: logs OTP to local dev log so QA can test without SMS access.
        await logOtpForTesting({
            accountNumber,
            mobileNo: normalizedMobileNo,
            otp: debugOtp,
        });
        console.info(`[OTP DEBUG] account=${accountNumber || 'N/A'} mobile=${normalizedMobileNo} otp=${debugOtp}`);
    }

    return {
        mobileNo: normalizedMobileNo,
        result,
        debugOtp,
    };
};

export const validateLoginOtp = async ({ mobileNo, otp }) => {
    const normalizedMobileNo = normalizeMobileNumber(mobileNo);
    const normalizedOtp = otp?.toString().trim();

    if (!normalizedMobileNo) {
        throw new Error('Registered mobile number is invalid.');
    }

    if (!normalizedOtp || !/^\d{4,8}$/.test(normalizedOtp)) {
        throw new Error('Enter a valid OTP.');
    }

    const response = await fetch(`${API_BASE_URL}${OTP_VALIDATE_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobileNo: normalizedMobileNo,
            otp: Number(normalizedOtp),
        }),
    });

    const result = await parseOtpApiResponse(response);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('OTP validation API endpoint was not found (404). Please verify the OTP service URL with the backend team.');
        }

        throw new Error('Failed to validate OTP. Please try again.');
    }

    if (result === -1 || result === false || result === 'false' || result === 0) {
        throw new Error('Invalid OTP. Please try again.');
    }

    return true;
};

/**
 * Login to API and retrieve JWT Bearer token
 * @returns {Promise<string>} JWT token
 */
const getAuthToken = async () => {
    // Return cached token if available
    if (cachedToken) {
        return cachedToken;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${API_LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: API_CREDENTIALS.username,
                password: API_CREDENTIALS.password
            })
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();

        // The token might be in different fields depending on API response
        // Common fields: token, access_token, jwt, bearerToken
        cachedToken = data.token || data.access_token || data.jwt || data.bearerToken || data;

        return cachedToken;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Failed to authenticate with API');
    }
};

/**
 * Validates and retrieves customer details by account number
 * @param {string} accountNumber - 10-digit CEB account number
 * @returns {Promise<Object>} Customer data object
 * @throws {Error} If validation fails or account not found
 */
export const validateAccountNumber = async (accountNumber) => {
    // Validate account number format (must be exactly 10 digits)
    const accountNumberStr = accountNumber.toString().trim();

    if (!accountNumberStr || accountNumberStr.length !== 10 || !/^\d{10}$/.test(accountNumberStr)) {
        throw new Error('Account number must be exactly 10 digits');
    }

    try {
        // Get authentication token
        const token = await getAuthToken();

        // Prepare headers with Bearer token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Make the API request
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                accountnumber: accountNumberStr
            })
        });

        // Try to parse JSON response, handle cases where it's not JSON
        let data;
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};

            // Debug logging
            console.log('API Response Status:', response.status);
            console.log('API Response Data:', data);
        } catch (jsonError) {
            console.error('JSON Parse Error:', jsonError);
            throw new Error('Invalid response from server. Please try again later.');
        }

        // Check if request was successful
        if (!response.ok) {
            console.error('HTTP Error - Status:', response.status, 'Data:', data);
            // Handle different error status codes
            if (response.status === 401) {
                // Token might be expired, clear cache and retry once
                cachedToken = null;
                throw new Error('Authentication failed. Please try again.');
            } else if (response.status === 400) {
                throw new Error(data.message || 'Invalid account number format');
            } else if (response.status === 404) {
                throw new Error('Account number not found. Please check and try again.');
            } else if (response.status === 500 || response.status === 503) {
                throw new Error('Service temporarily unavailable. Please try again later.');
            } else {
                throw new Error('An error occurred while validating account number');
            }
        }

        // Check the isSuccess flag in the response
        if (data.isSuccess === false) {
            console.error('API returned isSuccess=false:', data);
            // Handle error based on error code
            if (data.errorCode && data.errorCode.includes('404')) {
                throw new Error('Account number not found. Please check and try again.');
            } else if (data.errorCode && data.errorCode.includes('400')) {
                throw new Error('Invalid account number format');
            } else {
                throw new Error(data.message || 'Failed to retrieve customer details');
            }
        }

        // Validate that customer data exists
        if (!data.cebCustomerData) {
            throw new Error('No customer data returned');
        }

        console.log('Full API Customer Data:', data.cebCustomerData); // Debug log

        // Extract payment information from after_Payments array
        const payments = data.cebCustomerData.after_Payments || [];
        const lastPayment = payments.length > 0 ? payments[0] : null;

        // Return the customer data with standardized format
        return {
            accountNumber: data.cebCustomerData.accountnumber,
            customerName: data.cebCustomerData.name,
            address: data.cebCustomerData.address,
            tariff: data.cebCustomerData.tariff,
            customerType: data.cebCustomerData.customerType,
            billingMonth: data.cebCustomerData.billingMonth,
            currentBalance: data.cebCustomerData.currentBalanceLKR,
            recentPayments: payments,

            // Extract units/consumption data (try multiple possible field names)
            units: data.cebCustomerData.units ||
                data.cebCustomerData.consumption ||
                data.cebCustomerData.unitsConsumed ||
                data.cebCustomerData.totalUnits ||
                null,

            // Extract last payment data
            lastPaymentAmount: lastPayment?.paidAmount || lastPayment?.amount || null,
            lastPaymentDate: lastPayment?.paidDate || lastPayment?.paymentDate || lastPayment?.date || null,

            // Additional reading data
            previousReading: data.cebCustomerData.previousReading || null,
            currentReading: data.cebCustomerData.currentReading || null,

            status: 'active',
            // For compatibility with existing code
            email: '', // Not provided by API
            phone: data.cebCustomerData.mobileNo ||
                data.cebCustomerData.mobileNumber ||
                data.cebCustomerData.telephone ||
                data.cebCustomerData.phone ||
                data.cebCustomerData.contactNo ||
                '',
        };

    } catch (error) {
        // Network or fetch errors
        if (error.message.includes('fetch')) {
            throw new Error('Unable to connect to service. Please check your internet connection.');
        }
        // Re-throw custom errors
        throw error;
    }
};

/**
 * Validates account number format without making API call
 * @param {string} accountNumber - Account number to validate
 * @returns {boolean} True if format is valid
 */
export const isValidAccountNumberFormat = (accountNumber) => {
    const accountNumberStr = accountNumber.toString().trim();
    return accountNumberStr.length === 10 && /^\d{10}$/.test(accountNumberStr);
};
