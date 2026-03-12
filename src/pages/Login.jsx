import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isValidAccountNumberFormat } from '../services/cebApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import bgVideo from '../assets/electricity.mp4';
import logoImage from '../assets/ceb-1.png';

const Login = () => {
    const [loginMethod, setLoginMethod] = useState('account'); // 'account', 'mobile', or 'nic'
    const [accountNumber, setAccountNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [nicNumber, setNicNumber] = useState('');
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [showAccountSelection, setShowAccountSelection] = useState(false);
    const [error, setError] = useState('');
    const { login, getAccountsByMobileNumber, getAccountsByNICNumber, isAuthenticated, loading } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleAccountLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!accountNumber.trim()) {
            setError('Please enter your account number');
            return;
        }

        // Validate account number format (must be exactly 10 digits)
        if (!isValidAccountNumberFormat(accountNumber.trim())) {
            setError('Account number must be exactly 10 digits');
            return;
        }

        try {
            await login(accountNumber.trim());
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMobileSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!mobileNumber.trim()) {
            setError('Please enter your mobile number');
            return;
        }

        try {
            const accounts = await getAccountsByMobileNumber(mobileNumber.trim());
            if (accounts.length === 1) {
                // If only one account, login directly
                await login(accounts[0].accountNumber);
                navigate('/dashboard');
            } else {
                // Show account selection
                setAvailableAccounts(accounts);
                setShowAccountSelection(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNICSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!nicNumber.trim()) {
            setError('Please enter your NIC number');
            return;
        }

        try {
            const accounts = await getAccountsByNICNumber(nicNumber.trim());
            if (accounts.length === 1) {
                // If only one account, login directly
                await login(accounts[0].accountNumber);
                navigate('/dashboard');
            } else {
                // Show account selection
                setAvailableAccounts(accounts);
                setShowAccountSelection(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAccountSelect = async (accNumber) => {
        try {
            await login(accNumber);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const resetMobileLogin = () => {
        setShowAccountSelection(false);
        setAvailableAccounts([]);
        setMobileNumber('');
        setError('');
    };

    const resetNICLogin = () => {
        setShowAccountSelection(false);
        setAvailableAccounts([]);
        setNicNumber('');
        setError('');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={bgVideo} type="video/mp4" />
            </video>

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-blue-300/50 backdrop-blur-sm"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={logoImage}
                            alt="Electricity Distribution Lanka (Pvt) Ltd"
                            className="h-24 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                        EDL Customer Portal
                    </h1>

                </div>

                {/* Login Card with Gradient */}
                <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/50">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                        Sign In
                    </h2>

                    {/* Login Method Toggle */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod('account');
                                setError('');
                                resetMobileLogin();
                                resetNICLogin();
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${loginMethod === 'account'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Account Number
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setError('Login by mobile number is currently unavailable. Please use your account number.');
                            }}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-gray-400 cursor-not-allowed opacity-60"
                            disabled
                            title="Mobile login is currently unavailable"
                        >
                            Mobile Number
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setError('Login by NIC is currently unavailable. Please use your account number.');
                            }}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-gray-400 cursor-not-allowed opacity-60"
                            disabled
                            title="NIC login is currently unavailable"
                        >
                            NIC
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4">
                            <Alert type="error" message={error} onClose={() => setError('')} />
                        </div>
                    )}

                    {/* Account Number Login Form */}
                    {loginMethod === 'account' && (
                        <form onSubmit={handleAccountLogin} className="space-y-5">
                            <div>
                                <label htmlFor="accountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Account Number
                                </label>
                                <input
                                    id="accountNumber"
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Allow only digits
                                        if (value.length <= 10) {
                                            setAccountNumber(value);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter 10-digit account number"
                                    maxLength="10"
                                    pattern="\d{10}"
                                    disabled={loading}
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Enter your 10-digit CEB account number
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {/* Mobile Number Login Form */}
                    {loginMethod === 'mobile' && !showAccountSelection && (
                        <form onSubmit={handleMobileSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobileNumber"
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="07XXXXXXXX"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Checking...' : 'Continue'}
                            </button>
                        </form>
                    )}

                    {/* Account Selection */}
                    {loginMethod === 'mobile' && showAccountSelection && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-sm font-medium text-gray-700">Select your account</p>
                                <p className="text-xs text-gray-500 mt-1">Mobile: {mobileNumber}</p>
                            </div>

                            <div className="space-y-3">
                                {availableAccounts.map((account) => (
                                    <button
                                        key={account.accountNumber}
                                        onClick={() => handleAccountSelect(account.accountNumber)}
                                        disabled={loading}
                                        className="w-full p-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl text-left transition-all duration-200 hover:shadow-md disabled:opacity-50"
                                    >
                                        <div className="font-semibold text-gray-900">{account.customerName}</div>
                                        <div className="text-sm text-gray-600 mt-1">{account.accountNumber}</div>
                                        <div className="text-xs text-gray-500 mt-1">{account.address}</div>
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={resetMobileLogin}
                                className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 underline"
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {/* NIC Number Login Form */}
                    {loginMethod === 'nic' && !showAccountSelection && (
                        <form onSubmit={handleNICSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="nicNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    NIC Number
                                </label>
                                <input
                                    id="nicNumber"
                                    type="text"
                                    value={nicNumber}
                                    onChange={(e) => setNicNumber(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter your NIC number"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Checking...' : 'Continue'}
                            </button>
                        </form>
                    )}

                    {/* NIC Account Selection */}
                    {loginMethod === 'nic' && showAccountSelection && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-sm font-medium text-gray-700">Select your account</p>
                                <p className="text-xs text-gray-500 mt-1">NIC: {nicNumber}</p>
                            </div>

                            <div className="space-y-3">
                                {availableAccounts.map((account) => (
                                    <button
                                        key={account.accountNumber}
                                        onClick={() => handleAccountSelect(account.accountNumber)}
                                        disabled={loading}
                                        className="w-full p-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl text-left transition-all duration-200 hover:shadow-md disabled:opacity-50"
                                    >
                                        <div className="font-semibold text-gray-900">{account.customerName}</div>
                                        <div className="text-sm text-gray-600 mt-1">{account.accountNumber}</div>
                                        <div className="text-xs text-gray-500 mt-1">{account.address}</div>
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={resetNICLogin}
                                className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 underline"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-white drop-shadow">
                        Need help? Contact us at{' '}
                        <a href="tel:1987" className="text-white font-bold underline hover:text-gray-200">
                            1987
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;