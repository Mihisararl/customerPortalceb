import React from 'react';
import { formatCurrency, getStatusColor } from '../utils/helpers';

const BillCard = ({ bill, onClick, showDetails = false }) => {
    return (
        <div
            className={`card hover:shadow-lg transition duration-200 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{bill.billingPeriod}</h3>
                    <p className="text-sm text-gray-500">Bill ID: {bill.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Units Consumed:</span>
                    <span className="font-medium">{bill.unitsConsumed} kWh</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(bill.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 border-t pt-2">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(bill.totalAmount)}</span>
                </div>
            </div>

            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Fixed Charge:</span>
                        <span>{formatCurrency(bill.fixedCharge)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Energy Charge:</span>
                        <span>{formatCurrency(bill.energyCharge)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Fuel Adjustment:</span>
                        <span>{formatCurrency(bill.fuelAdjustment)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax:</span>
                        <span>{formatCurrency(bill.tax)}</span>
                    </div>
                </div>
            )}

            {bill.isPaid && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                    <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Paid on {new Date(bill.paidDate).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillCard;
