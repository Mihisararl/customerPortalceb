import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getStatusColor, generateBillPDF } from '../utils/helpers';
import BillCard from '../components/BillCard';
import billBgImage from '../assets/tariff.jpg';

const BillInquiry = () => {
    const { getAllBills, currentAccount } = useApp();
    const [selectedBill, setSelectedBill] = useState(null);
    const [filterYear, setFilterYear] = useState('all');
    const navigate = useNavigate();

    const bills = getAllBills();

    // Get unique years from bills
    const years = ['all', ...new Set(bills.map(bill => bill.year.toString()))];

    // Filter bills by year
    const filteredBills = filterYear === 'all'
        ? bills
        : bills.filter(bill => bill.year.toString() === filterYear);

    const handleBillClick = (bill) => {
        setSelectedBill(selectedBill?.id === bill.id ? null : bill);
    };

    const handlePrintBill = (bill) => {
        navigate(`/print-bill/${bill.id}`);
    };

    const handleDownloadPDF = (bill) => {
        generateBillPDF(bill, currentAccount);
    };

    return (
        <div className="page-container">
            {/* Header Box with Background Image */}
            <div className="mb-8 relative overflow-hidden rounded-2xl shadow-xl" style={{
                backgroundImage: `url(${billBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '160px'
            }}>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700/60 via-primary-800/65 to-primary-900/70"></div>

                {/* Content */}
                <div className="relative z-10 p-8">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">Bill Inquiry</h1>
                    <p className="text-amber-100 mt-3 text-lg drop-shadow">
                        View and download your current and past electricity bills
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="card mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Filter by year:</label>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year === 'all' ? 'All Years' : year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        Showing {filteredBills.length} bill{filteredBills.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Bills List */}
            {filteredBills.length === 0 ? (
                <div className="card text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No bills found</h3>
                    <p className="mt-2 text-gray-600">There are no bills matching your filter criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBills.map((bill) => (
                        <div key={bill.id} className="card hover:shadow-lg transition duration-200">
                            {/* Bill Header */}
                            <div
                                className="cursor-pointer"
                                onClick={() => handleBillClick(bill)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-xl font-semibold text-gray-900">{bill.billingPeriod}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Bill ID: {bill.id}</p>
                                    </div>
                                    <div className="text-left sm:text-right mt-3 sm:mt-0">
                                        <p className="text-2xl font-bold text-primary-600">{formatCurrency(bill.totalAmount)}</p>
                                        <p className="text-sm text-gray-600">Due: {formatDate(bill.dueDate)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Reading Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(bill.readingDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Units Consumed</p>
                                        <p className="font-medium text-gray-900">{bill.unitsConsumed} kWh</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Previous Reading</p>
                                        <p className="font-medium text-gray-900">{bill.previousReading} kWh</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Current Reading</p>
                                        <p className="font-medium text-gray-900">{bill.currentReading} kWh</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Bill Details */}
                            {selectedBill?.id === bill.id && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4">Charges Breakdown</h4>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fixed Charge</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(bill.fixedCharge)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Energy Charge ({bill.unitsConsumed} kWh)</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(bill.energyCharge)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fuel Adjustment</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(bill.fuelAdjustment)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(bill.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax (10%)</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(bill.tax)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-primary-600 pt-2 border-t-2">
                                            <span>Total Amount</span>
                                            <span>{formatCurrency(bill.totalAmount)}</span>
                                        </div>
                                    </div>

                                    {bill.isPaid && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center text-green-700">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium">Payment Received</p>
                                                    <p className="text-sm">Paid {formatCurrency(bill.paidAmount)} on {formatDate(bill.paidDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handlePrintBill(bill)}
                                            className="flex-1 btn-primary flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                            Print Bill
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(bill)}
                                            className="flex-1 btn-secondary flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Toggle Button */}
                            <button
                                onClick={() => handleBillClick(bill)}
                                className="mt-4 w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
                            >
                                {selectedBill?.id === bill.id ? (
                                    <>
                                        Show less
                                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Show details
                                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BillInquiry;
