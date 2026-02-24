import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, generatePaymentSlipPDF } from '../utils/helpers';
import paymentBgImage from '../assets/bulb.jpg';

const PaymentHistory = () => {
    const { getPaymentHistory, getAllBills, currentAccount } = useApp();
    const [selectedPayment, setSelectedPayment] = useState(null);

    const payments = getPaymentHistory();
    const bills = getAllBills();

    const handlePaymentClick = (payment) => {
        setSelectedPayment(selectedPayment?.id === payment.id ? null : payment);
    };

    const getBillForPayment = (billId) => bills.find(bill => bill.id === billId);

    const handleDownloadReceipt = (payment) => {
        const bill = getBillForPayment(payment.billId);
        if (bill) generatePaymentSlipPDF(payment, bill, currentAccount);
    };

    const methodColor = (method) => {
        const m = method?.toLowerCase();
        if (m === 'online banking') return { bg: '#eff6ff', color: '#2563eb' };
        if (m === 'credit card') return { bg: '#f5f3ff', color: '#7c3aed' };
        if (m === 'cash') return { bg: '#f0fdf4', color: '#16a34a' };
        return { bg: '#f8fafc', color: '#475569' };
    };

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: '#f0f4f8', minHeight: '100vh', padding: '28px 24px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                .ph-card { background: white; border-radius: 18px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
                .pay-row { border-radius: 14px; border: 1.5px solid #e8edf2; background: white; transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer; }
                .pay-row:hover { border-color: #93c5fd; box-shadow: 0 4px 18px rgba(37,99,235,0.08); }
                .pay-row.active { border-color: #2563eb; box-shadow: 0 4px 20px rgba(37,99,235,0.12); }
                .dl-btn { background: linear-gradient(135deg, #1d4ed8, #0ea5e9); color: white; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; transition: opacity 0.2s; }
                .dl-btn:hover { opacity: 0.9; }
                .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
                .detail-cell { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                .detail-cell:nth-last-child(-n+2) { border-bottom: none; }
            `}</style>

            {/* Header Box with Background Image */}
            <div style={{
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '18px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                backgroundImage: `url(${paymentBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '160px'
            }}>
                {/* Overlay for better text readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(19, 41, 87, 0.6), rgba(31, 85, 172, 0.65), rgba(33, 91, 216, 0.7))'
                }}></div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, padding: '32px' }}>
                    <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Payment History</h1>
                    <p style={{ margin: '12px 0 0', fontSize: '16px', color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>
                        View and download all your past payment records and receipts
                    </p>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="ph-card" style={{ padding: '64px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <svg width="28" height="28" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p style={{ fontWeight: 700, color: '#374151', fontSize: '16px', margin: '0 0 6px' }}>No payment history</p>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You haven't made any payments yet.</p>
                </div>
            ) : (
                <>
                    {/* Summary Strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                        <div className="ph-card" style={{ padding: '28px 24px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Total Payments</p>
                            <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{payments.length}</p>
                        </div>

                        <div className="ph-card" style={{ padding: '28px 24px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Total Paid</p>
                            <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{formatCurrency(totalPaid)}</p>
                        </div>

                        <div className="ph-card" style={{ padding: '28px 24px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Last Payment</p>
                            <p style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{formatDate(payments[0].paymentDate)}</p>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 80px', gap: '12px', padding: '12px 20px', marginBottom: '12px' }}>
                        {['Payment', 'Date', 'Method', 'Amount', ''].map((h, i) => (
                            <p key={i} style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</p>
                        ))}
                    </div>

                    {/* Payment Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {payments.map((payment) => {
                            const bill = getBillForPayment(payment.billId);
                            const isOpen = selectedPayment?.id === payment.id;
                            const mc = methodColor(payment.method);

                            return (
                                <div key={payment.id} className={`pay-row ${isOpen ? 'active' : ''}`}>
                                    {/* Main Row */}
                                    <div
                                        style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 80px', gap: '12px', padding: '16px 20px', alignItems: 'center' }}
                                        onClick={() => handlePaymentClick(payment)}
                                    >
                                        {/* Payment ID + Status */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ background: '#f0fdf4', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.3px' }}>{payment.id}</p>
                                                <span style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '6px', marginTop: '6px' }}>
                                                    {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div>
                                            <p style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{formatDate(payment.paymentDate)}</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Ref: {payment.referenceNumber}</p>
                                        </div>

                                        {/* Method */}
                                        <div>
                                            <span style={{ background: mc.bg, color: mc.color, fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', letterSpacing: '0.2px' }}>
                                                {payment.method}
                                            </span>
                                        </div>

                                        {/* Amount */}
                                        <p style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.3px' }}>{formatCurrency(payment.amount)}</p>

                                        {/* Chevron */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isOpen ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                                <svg width="14" height="14" fill="none" stroke={isOpen ? '#2563eb' : '#94a3b8'} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isOpen && bill && (
                                        <div style={{ borderTop: '1.5px solid #e8edf2', padding: '20px', background: '#fafbfc', borderRadius: '0 0 14px 14px' }}>
                                            <p style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Payment Details</p>
                                            <div className="detail-grid">
                                                {[
                                                    ['Bill Period', bill.billingPeriod],
                                                    ['Bill ID', bill.id],
                                                    ['Units Consumed', `${bill.unitsConsumed} kWh`],
                                                    ['Bill Amount', formatCurrency(bill.totalAmount)],
                                                    ['Payment Method', payment.method],
                                                    ['Reference No.', payment.referenceNumber],
                                                ].map(([label, value], i) => (
                                                    <div key={i} className="detail-cell" style={{ paddingRight: i % 2 === 0 ? '24px' : '0' }}>
                                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.3px' }}>{label}</p>
                                                        <p style={{ margin: '5px 0 0', fontSize: '15px', color: '#0f172a', fontWeight: 600 }}>{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '18px' }}>
                                                <button className="dl-btn" onClick={() => handleDownloadReceipt(payment)}>
                                                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Download Receipt
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentHistory;