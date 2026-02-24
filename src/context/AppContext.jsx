import React, { createContext, useContext, useState, useEffect } from 'react';
import { customers, bills, payments, notifications, getAccountsByMobile, getAccountsByNIC } from '../data/mockData';

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

    // Load saved account from localStorage on mount
    useEffect(() => {
        const savedAccount = localStorage.getItem('currentAccount');
        if (savedAccount) {
            const accountData = JSON.parse(savedAccount);
            setCurrentAccount(accountData);
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const login = async (accountNumber) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const customer = customers.find(c => c.accountNumber === accountNumber);

                if (customer) {
                    setCurrentAccount(customer);
                    setIsAuthenticated(true);
                    localStorage.setItem('currentAccount', JSON.stringify(customer));
                    setLoading(false);
                    resolve(customer);
                } else {
                    const errorMsg = 'Account number not found. Please check and try again.';
                    setError(errorMsg);
                    setLoading(false);
                    reject(new Error(errorMsg));
                }
            }, 1000);
        });
    };

    // Get accounts by mobile number
    const getAccountsByMobileNumber = async (mobileNumber) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const accounts = getAccountsByMobile(mobileNumber);

                if (accounts.length > 0) {
                    setLoading(false);
                    resolve(accounts);
                } else {
                    const errorMsg = 'No accounts found for this mobile number.';
                    setError(errorMsg);
                    setLoading(false);
                    reject(new Error(errorMsg));
                }
            }, 1000);
        });
    };

    // Get accounts by NIC
    const getAccountsByNICNumber = async (nic) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const accounts = getAccountsByNIC(nic);

                if (accounts.length > 0) {
                    setLoading(false);
                    resolve(accounts);
                } else {
                    const errorMsg = 'No accounts found for this NIC.';
                    setError(errorMsg);
                    setLoading(false);
                    reject(new Error(errorMsg));
                }
            }, 1000);
        });
    };

    // Logout function
    const logout = () => {
        setCurrentAccount(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentAccount');
    };

    // Get current bills for logged-in account
    const getCurrentBill = () => {
        if (!currentAccount) return null;
        const accountBills = bills[currentAccount.accountNumber] || [];
        return accountBills.find(bill => !bill.isPaid) || accountBills[0] || null;
    };

    // Get all bills for logged-in account
    const getAllBills = () => {
        if (!currentAccount) return [];
        return bills[currentAccount.accountNumber] || [];
    };

    // Get bill by ID
    const getBillById = (billId) => {
        if (!currentAccount) return null;
        const accountBills = bills[currentAccount.accountNumber] || [];
        return accountBills.find(bill => bill.id === billId) || null;
    };

    // Get payment history
    const getPaymentHistory = () => {
        if (!currentAccount) return [];
        return payments[currentAccount.accountNumber] || [];
    };

    // Get notifications
    const getNotifications = () => {
        if (!currentAccount) return [];
        return notifications[currentAccount.accountNumber] || [];
    };

    // Get last payment
    const getLastPayment = () => {
        if (!currentAccount) return null;
        const history = payments[currentAccount.accountNumber] || [];
        return history.length > 0 ? history[0] : null;
    };

    // Check for overdue bills
    const hasOverdueBills = () => {
        if (!currentAccount) return false;
        const accountBills = bills[currentAccount.accountNumber] || [];
        return accountBills.some(bill => bill.status === 'overdue');
    };

    const value = {
        currentAccount,
        isAuthenticated,
        loading,
        error,
        login,
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
