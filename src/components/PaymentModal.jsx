import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import cebLogo from '../assets/ceb-1.png';

const PaymentModal = ({ isOpen, onClose, bill, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        bankName: '',
        accountNumber: '',
        mobileNumber: ''
    });

    const paymentMethods = [
        { id: 'credit-card', name: 'Credit Card', icon: '💳' },
        { id: 'debit-card', name: 'Debit Card', icon: '💳' },
        { id: 'online-banking', name: 'Online Banking', icon: '🏦' },
        { id: 'mobile-payment', name: 'Mobile Payment', icon: '📱' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess({
                billId: bill.id,
                amount: bill.totalAmount,
                paymentMethod,
                paymentDate: new Date().toISOString(),
                transactionId: `TXN${Date.now()}`
            });
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 pb-8 px-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <img
                                src={cebLogo}
                                alt="CEB Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Electricity Distribution Lanka (Pvt) Ltd</h2>
                                <p className="text-blue-100 mt-1">Customer Bill Statement</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Bill Summary */}
                    <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex justify-between text-white">
                            <span className="text-sm opacity-90">Bill Period:</span>
                            <span className="font-semibold">{bill.billingPeriod}</span>
                        </div>
                        <div className="flex justify-between text-white mt-2">
                            <span className="text-sm opacity-90">Amount to Pay:</span>
                            <span className="text-2xl font-bold">{formatCurrency(bill.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Payment Method Selection */}
                    {!paymentMethod ? (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                    >
                                        <div className="text-4xl mb-2">{method.icon}</div>
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                                            {method.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Back Button */}
                            <button
                                onClick={() => setPaymentMethod('')}
                                className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Change Payment Method
                            </button>

                            {/* Payment Forms */}
                            <form onSubmit={handlePayment}>
                                {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {paymentMethod === 'credit-card' ? 'Credit Card' : 'Debit Card'} Details
                                        </h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={paymentDetails.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={paymentDetails.cardName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={paymentDetails.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    required
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={paymentDetails.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    maxLength="4"
                                                    required
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'online-banking' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Online Banking Details</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Bank
                                            </label>
                                            <select
                                                name="bankName"
                                                value={paymentDetails.bankName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Choose your bank</option>
                                                <option value="Bank of Ceylon">Bank of Ceylon</option>
                                                <option value="Commercial Bank">Commercial Bank</option>
                                                <option value="Sampath Bank">Sampath Bank</option>
                                                <option value="HNB">Hatton National Bank</option>
                                                <option value="NDB">National Development Bank</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={paymentDetails.accountNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter your account number"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'mobile-payment' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Mobile Payment Details</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="mobileNumber"
                                                value={paymentDetails.mobileNumber}
                                                onChange={handleInputChange}
                                                placeholder="07X XXX XXXX"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <p className="text-sm text-blue-800">
                                                📱 You will receive an OTP on your mobile number to confirm the payment.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Button */}
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            `Pay ${formatCurrency(bill.totalAmount)}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
