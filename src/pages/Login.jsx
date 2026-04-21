import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isValidAccountNumberFormat } from '../services/cebApi';
import Alert from '../components/Alert';
import bgVideo from '../assets/electricity.mp4';
import logoImage from '../assets/ceb-1.png';

const Login = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loginStep, setLoginStep] = useState('account');
    const [validatedAccountName, setValidatedAccountName] = useState('');
    const [otpTarget, setOtpTarget] = useState('');
    const [error, setError] = useState('');
    const {
        validateAccountForLogin,
        requestOtpForAccount,
        verifyOtpAndLogin,
        clearPendingOtpLogin,
        isAuthenticated,
        loading,
    } = useApp();
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
            const accountResponse = await validateAccountForLogin(accountNumber.trim());
            setValidatedAccountName(accountResponse.customerName || '');
            setLoginStep('mobile');
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
            const otpResponse = await requestOtpForAccount(accountNumber.trim(), mobileNumber.trim());
            setOtpTarget(otpResponse.maskedMobileNo || otpResponse.mobileNo || 'your mobile number');
            setLoginStep('otp');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!otpCode.trim()) {
            setError('Please enter the OTP code');
            return;
        }

        try {
            await verifyOtpAndLogin(otpCode.trim());
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResendOtp = async () => {
        setError('');

        try {
            const otpResponse = await requestOtpForAccount(accountNumber.trim(), mobileNumber.trim());
            setOtpTarget(otpResponse.maskedMobileNo || otpResponse.mobileNo || 'your mobile number');
        } catch (err) {
            setError(err.message);
        }
    };

    const resetLoginFlow = () => {
        clearPendingOtpLogin();
        setLoginStep('account');
        setValidatedAccountName('');
        setMobileNumber('');
        setOtpCode('');
        setOtpTarget('');
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
            <div className="absolute inset-0 bg-primary-600/20 "></div>

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={logoImage}
                            alt="Electricity Distribution Lanka (Pvt) Ltd"
                            className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                        EDL Customer Portal
                    </h1>

                </div>

                {/* Login Card with Gradient */}
                <div className="bg-gradient-to-br from-white via-amber-50 to-white rounded-2xl shadow-2xl p-5 sm:p-8 backdrop-blur-sm border border-white/50">
                    <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
                        {loginStep === 'otp' ? 'Verify OTP' : loginStep === 'mobile' ? 'Enter Mobile Number' : 'Sign In'}
                    </h2>

                    {error && (
                        <div className="mb-4">
                            <Alert type="error" message={error} onClose={() => setError('')} />
                        </div>
                    )}

                    {loginStep === 'account' && (
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Enter 10-digit account number"
                                    maxLength="10"
                                    pattern="\d{10}"
                                    disabled={loading}
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Enter your 10-digit account number to continue.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Checking Account...' : 'Continue'}
                            </button>
                        </form>
                    )}

                    {loginStep === 'mobile' && (
                        <form onSubmit={handleMobileSubmit} className="space-y-5">
                            <div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Account verified{validatedAccountName ? ` for ${validatedAccountName}` : ''}.
                                </p>
                                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobileNumber"
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 12) {
                                            setMobileNumber(value);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="07XXXXXXXX"
                                    disabled={loading}
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Enter the mobile number that should receive the OTP.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetLoginFlow}
                                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:border-primary-500 hover:text-primary-700 transition-all duration-300"
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    )}

                    {loginStep === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <p className="text-sm text-gray-600 mb-3">
                                    OTP sent to <span className="font-semibold text-gray-900">{otpTarget}</span>
                                </p>
                                <label htmlFor="otpCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    OTP Code
                                </label>
                                <input
                                    id="otpCode"
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 8) {
                                            setOtpCode(value);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Enter OTP"
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:border-primary-500 hover:text-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={resetLoginFlow}
                                className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 underline"
                            >
                                Back
                            </button>
                        </form>
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