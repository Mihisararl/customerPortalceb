import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import cebLogo from '../assets/ceb-1.png';

const PrintBill = () => {
    const { billId } = useParams();
    const navigate = useNavigate();
    const { getBillById, currentAccount } = useApp();

    const bill = getBillById(billId);

    useEffect(() => {
        if (!bill) {
            navigate('/bills');
        }
    }, [bill, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate('/bills');
    };

    if (!bill) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Print Controls - Hidden when printing */}
            <div className="no-print bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Bills
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn-primary flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Bill
                    </button>
                </div>
            </div>

            {/* Printable Bill */}
            <div className="max-w-4xl mx-auto p-3 sm:p-6 lg:p-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                            <div className="flex items-start sm:items-center gap-4">
                                <img
                                    src={cebLogo}
                                    alt="CEB Logo"
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                                />
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">Electricity Distribution Lanka (Pvt) Ltd</h1>
                                    <p className="text-primary-100">Customer Bill Statement</p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="bg-white text-primary-600 px-4 py-2 rounded-lg">
                                    <p className="text-xs font-medium">Bill ID</p>
                                    <p className="text-lg font-bold">{bill.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill Details */}
                    <div className="px-4 py-5 sm:px-8 sm:py-6">
                        {/* Customer and Bill Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                                    Customer Information
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-600">Account Number</p>
                                        <p className="font-semibold text-gray-900">{currentAccount.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Customer Name</p>
                                        <p className="font-semibold text-gray-900">{currentAccount.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Address</p>
                                        <p className="font-semibold text-gray-900">{currentAccount.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-900">{currentAccount.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Tariff Type</p>
                                        <p className="font-semibold text-gray-900">{currentAccount.tariff}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                                    Bill Information
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-600">Billing Period</p>
                                        <p className="font-semibold text-gray-900">{bill.billingPeriod}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Reading Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(bill.readingDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Due Date</p>
                                        <p className="font-semibold text-red-600">{formatDate(bill.dueDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Status</p>
                                        <p className="font-semibold text-gray-900 capitalize">{bill.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meter Reading */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                                Meter Reading Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Previous Reading</p>
                                    <p className="text-2xl font-bold text-gray-900">{bill.previousReading}</p>
                                    <p className="text-xs text-gray-500">kWh</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Current Reading</p>
                                    <p className="text-2xl font-bold text-gray-900">{bill.currentReading}</p>
                                    <p className="text-xs text-gray-500">kWh</p>
                                </div>
                                <div className="bg-primary-50 p-4 rounded-lg">
                                    <p className="text-sm text-primary-700 mb-1">Units Consumed</p>
                                    <p className="text-2xl font-bold text-primary-900">{bill.unitsConsumed}</p>
                                    <p className="text-xs text-primary-600">kWh</p>
                                </div>
                            </div>
                        </div>

                        {/* Charges Breakdown */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                                Charges Breakdown
                            </h2>
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-2">
                                    <span className="text-gray-700">Fixed Charge</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(bill.fixedCharge)}</span>
                                </div>
                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-2">
                                    <span className="text-gray-700">Energy Charge ({bill.unitsConsumed} kWh)</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(bill.energyCharge)}</span>
                                </div>
                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-2">
                                    <span className="text-gray-700">Fuel Adjustment Charge</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(bill.fuelAdjustment)}</span>
                                </div>
                                <div className="border-t-2 border-gray-300 pt-2 mt-2">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-2">
                                        <span className="text-gray-700 font-medium">Subtotal</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(bill.subtotal)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-2">
                                    <span className="text-gray-700">Tax (10%)</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(bill.tax)}</span>
                                </div>
                                <div className="border-t-4 border-primary-600 pt-3 mt-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                                        <span className="text-xl font-bold text-primary-900">Total Amount Due</span>
                                        <span className="text-2xl font-bold text-primary-600">{formatCurrency(bill.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        {bill.isPaid && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <svg className="w-12 h-12 text-green-600 sm:mr-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-lg font-bold text-green-900">PAID</p>
                                        <p className="text-sm text-green-700">
                                            Payment of {formatCurrency(bill.paidAmount)} received on {formatDate(bill.paidDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Important Notes */}
                        <div className="bg-amber-50 border-l-4 border-accent-400 p-4 mb-6">
                            <h3 className="text-sm font-semibold text-primary-900 mb-2">Important Information:</h3>
                            <ul className="text-xs text-primary-800 space-y-1 list-disc list-inside">
                                <li>Please pay your bill before the due date to avoid late payment charges</li>
                                <li>For payment inquiries, contact our customer service hotline: 1987</li>
                                <li>Keep this bill for your records</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-gray-200 pt-6 text-center text-sm text-gray-600">
                            <p className="font-semibold mb-2">Electricity Distribution Lanka (Pvt) Ltd</p>
                            <p>No. 50, Sir Chittampalam A. Gardiner Mawatha, Colombo 02</p>
                            <p>Hotline: 1987 | Email: customercare@ceb.lk</p>
                            <p className="mt-3 text-xs">
                                This is a computer-generated bill. For any discrepancies, please contact us immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintBill;
