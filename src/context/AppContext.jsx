import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getMobileNumberByAccount,
    maskMobileNumber,
    sendLoginOtp,
    validateAccountNumber,
    validateLoginOtp
} from '../services/backendApi';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pendingOtpLogin, setPendingOtpLogin] = useState(null);

    // Load saved account from localStorage on mount
    useEffect(() => {
        const savedAccount = localStorage.getItem('currentAccount');
        if (savedAccount) {
            const accountData = JSON.parse(savedAccount);
            setCurrentAccount(accountData);
            setIsAuthenticated(true);
        }
    }, []);

    const validateAccountForLogin = async (accountNumber) => {
        setLoading(true);
        setError(null);

        try {
            const customerData = await validateAccountNumber(accountNumber);

            setPendingOtpLogin({
                accountNumber: customerData.accountNumber,
                mobileNo: customerData.mobileNo || '',
                debugOtp: '',
            });

            setLoading(false);
            return {
                accountNumber: customerData.accountNumber,
                customerName: customerData.customerName,
                mobileNo: customerData.mobileNo || '',
                maskedMobileNo: customerData.mobileNo ? maskMobileNumber(customerData.mobileNo) : '',
            };
        } catch (err) {
            const errorMsg = err.message || 'Failed to validate account number';
            setError(errorMsg);
            setLoading(false);
            throw new Error(errorMsg);
        }
    };

    const requestOtpForAccount = async (accountNumber) => {
        setLoading(true);
        setError(null);

        try {
            const resolvedAccountNumber = pendingOtpLogin?.accountNumber || accountNumber;

            if (!resolvedAccountNumber) {
                throw new Error('Please validate account number first.');
            }

            const mobileLookup = pendingOtpLogin?.mobileNo
                ? { mobileNo: pendingOtpLogin.mobileNo }
                : await getMobileNumberByAccount(resolvedAccountNumber);

            if (!mobileLookup.mobileNo) {
                throw new Error('Registered mobile number is unavailable for this account.');
            }

            const otpResult = await sendLoginOtp(mobileLookup.mobileNo);

            setPendingOtpLogin({
                accountNumber: resolvedAccountNumber,
                mobileNo: otpResult.mobileNo,
                debugOtp: '',
            });

            setLoading(false);
            return {
                mobileNo: otpResult.mobileNo,
                maskedMobileNo: otpResult.maskedMobileNo,
                debugOtp: '',
            };
        } catch (err) {
            const errorMsg = err.message || 'Failed to send OTP';
            setError(errorMsg);
            setLoading(false);
            throw new Error(errorMsg);
        }
    };

    const verifyOtpAndLogin = async (otp) => {
        setLoading(true);
        setError(null);

        try {
            if (!pendingOtpLogin?.mobileNo || !pendingOtpLogin?.accountNumber) {
                throw new Error('Please request OTP first.');
            }

            await validateLoginOtp(pendingOtpLogin.mobileNo, otp);

            const customerData = await validateAccountNumber(pendingOtpLogin.accountNumber);

            setCurrentAccount(customerData);
            setIsAuthenticated(true);
            localStorage.setItem('currentAccount', JSON.stringify(customerData));
            setPendingOtpLogin(null);
            setLoading(false);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to verify OTP';
            setError(errorMsg);
            setLoading(false);
            throw new Error(errorMsg);
        }
    };

    const clearPendingOtpLogin = () => {
        setPendingOtpLogin(null);
    };

    // Get accounts by mobile number - Not available (no API endpoint)
    const getAccountsByMobileNumber = async (mobileNumber) => {
        setLoading(true);
        setError(null);

        const errorMsg = 'Login by mobile number is not available. Please use account number with OTP.';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
    };

    // Get accounts by NIC - Not available (no API endpoint)
    const getAccountsByNICNumber = async (nic) => {
        setLoading(true);
        setError(null);

        const errorMsg = 'Login by NIC is not available. Please use account number with OTP.';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
    };

    // Logout function
    const logout = () => {
        setCurrentAccount(null);
        setIsAuthenticated(false);
        setPendingOtpLogin(null);
        localStorage.removeItem('currentAccount');
    };

    const mapRecentPaymentsToHistory = () => {
        if (!currentAccount?.recentPayments || !Array.isArray(currentAccount.recentPayments)) {
            return [];
        }

        return currentAccount.recentPayments
            .map((payment, index) => {
                const paymentDate = payment.paidDate || payment.paymentDate || payment.date || null;
                const amount = Number(payment.paidAmount ?? payment.amount ?? 0);

                return {
                    id: payment.paymentId || payment.id || `PAY-${currentAccount.accountNumber}-${index + 1}`,
                    billId: payment.billId || null,
                    paymentDate,
                    method: payment.method || 'API Payment',
                    amount,
                    status: payment.status || 'completed',
                    referenceNumber: payment.referenceNumber || payment.receiptNumber || 'N/A'
                };
            })
            .filter((payment) => payment.paymentDate)
            .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    };

    // Get current bills for logged-in account
    const getCurrentBill = () => null;

    // Get all bills for logged-in account
    const getAllBills = () => [];

    // Get bill by ID
    const getBillById = (billId) => null;

    // Get Last Bill Payment
    const getPaymentHistory = () => mapRecentPaymentsToHistory();

    // Get notifications
    const getNotifications = () => [];

    // Get last payment
    const getLastPayment = () => {
        const history = mapRecentPaymentsToHistory();
        return history.length > 0 ? history[0] : null;
    };

    // Check for overdue bills
    const hasOverdueBills = () => false;

    const value = {
        currentAccount,
        isAuthenticated,
        loading,
        error,
        pendingOtpLogin,
        validateAccountForLogin,
        requestOtpForAccount,
        verifyOtpAndLogin,
        clearPendingOtpLogin,
        logout,
        getAccountsByMobileNumber,
        getAccountsByNICNumber,
        getCurrentBill,
        getAllBills,
        getBillById,
        getPaymentHistory,
        getNotifications,
        getLastPayment,
        hasOverdueBills
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
