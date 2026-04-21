import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, generatePaymentSlipPDF } from '../utils/helpers';
import paymentBgImage from '../assets/tariff.jpg';

const PaymentHistory = () => {
    const { getPaymentHistory, getAllBills, currentAccount } = useApp();
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [visibleRowIndices, setVisibleRowIndices] = useState(new Set());
    const rowsContainerRef = useRef(null);

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

    const methodConfig = (method) => {
        const m = method?.toLowerCase();
        if (m === 'online banking') return { bg: 'rgba(253, 236, 88, 0.23)', color: '#557a00' };
        if (m === 'credit card') return { bg: 'rgba(253, 236, 88, 0.23)', color: '#557a00' };
        if (m === 'cash') return { bg: 'rgba(253, 236, 88, 0.23)', color: '#557a00'};
        if (m === 'api payment') return { bg: 'rgba(253, 236, 88, 0.23)', color: '#557a00' };
        return { bg: 'rgba(253, 236, 88, 0.23)', color: '#557a00' };
    };

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    // Intersection Observer for scroll-triggered animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowIndex = parseInt(entry.target.getAttribute('data-row-index'));
                        setVisibleRowIndices((prev) => {
                            const updated = new Set(prev);
                            updated.add(rowIndex);
                            return updated;
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (rowsContainerRef.current) {
            const rows = rowsContainerRef.current.querySelectorAll('[data-row-index]');
            rows.forEach((row) => observer.observe(row));
        }

        return () => observer.disconnect();
    }, [payments.length]);

    return (
        <div className="ph-page" style={{
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            background: '#fcf9e8',
            minHeight: '100vh',
            padding: '32px 28px',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

                * { box-sizing: border-box; }

                .ph-hero {
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    margin-bottom: 28px;
                    min-height: 180px;
                    display: flex;
                    align-items: flex-end;
                }

                .ph-hero-bg {
                    position: absolute;
                    inset: 0;
                    background-image: var(--hero-bg);
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.45) saturate(1.1);
                }

                .ph-hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(120deg, rgba(100,10,10,0.82) 0%, rgba(180,30,30,0.6) 55%, rgba(30,10,60,0.7) 100%);
                }

                .ph-hero-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                .ph-hero-content {
                    position: relative;
                    z-index: 10;
                    padding: 32px 36px;
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 100px;
                    padding: 5px 14px 5px 10px;
                    font-size: 12px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    letter-spacing: 0.3px;
                    margin-bottom: 10px;
                    backdrop-filter: blur(4px);
                }

                .stat-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px 28px;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    border-radius: 20px 20px 0 0;
                }

                .stat-card.one::before { background: linear-gradient(90deg, #eb3c25, #faeb60); }
                .stat-card.two::before { background: linear-gradient(90deg, #dd6637, #f8d255); }
                .stat-card.three::before { background: linear-gradient(90deg, #ed3a76, #fcdc84); }

                .pay-row {
                    background: white;
                    border-radius: 16px;
                    border: 1.5px solid #eef0f4;
                    overflow: hidden;
                    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
                    cursor: pointer;
                }

                .pay-row.animated {
                    animation: rowFadeSlideIn 0.8s ease-out forwards;
                }

                @keyframes rowFadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .pay-row:hover {
                    border-color: #c7d7f7;
                    box-shadow: 0 4px 20px rgba(37,99,235,0.07);
                    transform: translateY(-1px);
                }

                .pay-row.active {
                    border-color: #93b4f5;
                    box-shadow: 0 6px 28px rgba(37,99,235,0.11);
                }

                .pay-row-main {
                    display: grid;
                    grid-template-columns: 2.2fr 1.3fr 1.3fr 1fr 52px;
                    gap: 12px;
                    padding: 18px 22px;
                    align-items: center;
                }

                .pay-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #fef9e7, #fdf2c8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: #fffef0;
                    color: #7A0026;
                    font-size: 11.5px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 100px;
                    letter-spacing: 0.2px;
                    margin-top: 5px;
                }

                .chevron-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    transition: background 0.2s;
                    margin-left: auto;
                }

                .pay-row.active .chevron-btn {
                    background: #eff6ff;
                }

                .detail-panel {
                    border-top: 1.5px solid #eef0f4;
                    padding: 24px 22px;
                    background: linear-gradient(to bottom, #fafbfd, #f6f8fc);
                    animation: slideDown 0.22s ease;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 0;
                }

                .ph-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 18px;
                    margin-bottom: 28px;
                }

                .ph-section-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    padding: 0 4px;
                    gap: 12px;
                }

                .ph-rows {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .method-pill {
                    max-width: 100%;
                    flex-wrap: wrap;
                }

                @media (max-width: 1024px) {
                    .ph-page {
                        padding: 24px 20px !important;
                    }

                    .ph-hero-content {
                        padding: 28px;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 18px;
                    }

                    .ph-stats-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .detail-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 767px) {
                    .ph-page {
                        padding: 18px 14px !important;
                    }

                    .ph-hero {
                        min-height: auto;
                        border-radius: 20px;
                    }

                    .ph-hero-content {
                        padding: 22px 18px;
                    }

                    .ph-hero-content h1 {
                        font-size: 28px !important;
                    }

                    .ph-stats-grid {
                        grid-template-columns: 1fr;
                        gap: 14px;
                    }

                    .stat-card {
                        padding: 20px 18px;
                    }

                    .ph-section-head {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .table-header {
                        display: none;
                    }

                    .pay-row-main {
                        grid-template-columns: minmax(0, 1fr) auto;
                        grid-template-areas:
                            'primary chevron'
                            'meta meta'
                            'method method'
                            'amount amount';
                        gap: 14px;
                        padding: 16px;
                        align-items: start;
                    }

                    .pay-primary { grid-area: primary; }
                    .pay-meta { grid-area: meta; }
                    .pay-method { grid-area: method; }
                    .pay-amount {
                        grid-area: amount;
                        font-size: 18px;
                    }
                    .pay-chevron {
                        grid-area: chevron;
                        align-self: start;
                    }

                    .pay-avatar {
                        width: 36px;
                        height: 36px;
                    }

                    .detail-panel {
                        padding: 18px 16px;
                    }

                    .detail-grid {
                        grid-template-columns: 1fr;
                    }

                    .detail-cell {
                        padding: 12px 0;
                    }

                    .detail-cell:nth-last-child(-n+3) {
                        border-bottom: 1px solid #eef0f4;
                    }

                    .detail-cell:last-child {
                        border-bottom: none;
                    }

                    .detail-actions {
                        margin-top: 18px !important;
                        flex-direction: column;
                        align-items: stretch !important;
                    }

                    .dl-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .empty-card {
                        padding: 48px 20px;
                    }
                }

                .detail-cell {
                    padding: 10px 0;
                    border-bottom: 1px solid #eef0f4;
                }

                .detail-cell:nth-last-child(-n+3) {
                    border-bottom: none;
                }

                .dl-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0284c7 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 11px 22px;
                    font-size: 13.5px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: inherit;
                    letter-spacing: 0.2px;
                    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
                    transition: all 0.2s;
                }

                .dl-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(37,99,235,0.4);
                }

                .dl-btn:active {
                    transform: translateY(0);
                }

                .table-header {
                    display: grid;
                    grid-template-columns: 2.2fr 1.3fr 1.3fr 1fr 52px;
                    gap: 12px;
                    padding: 10px 22px 10px;
                    margin-bottom: 10px;
                }

                .section-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #49515c;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .empty-card {
                    background: white;
                    border-radius: 20px;
                    padding: 72px 40px;
                    text-align: center;
                    border: 1.5px dashed #e2e8f0;
                }

                .amount-text {
                    font-family: 'DM Mono', monospace;
                    font-size: 16px;
                    font-weight: 500;
                    color: #0f172a;
                    letter-spacing: -0.3px;
                }

                .ref-text {
                    font-family: 'DM Mono', monospace;
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 3px;
                }
            `}</style>

            {/* Hero Header */}
            <div className="ph-hero">
                <div className="ph-hero-bg" style={{ '--hero-bg': `url(${paymentBgImage})` }}></div>
                <div className="ph-hero-overlay"></div>
                <div className="ph-hero-grid"></div>

                <div className="ph-hero-content">
                    <div>
                        <div className="hero-badge">
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                            Payment Records
                        </div>
                        <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                            Last Bill Payment
                        </h1>
                        <p style={{ margin: '10px 0 0', fontSize: '14.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                            View and download all your past payment records and receipts
                        </p>
                    </div>

                    {payments.length > 0 && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total Paid</p>
                            <p style={{ margin: '4px 0 0', fontSize: '30px', fontWeight: 700, color: 'white', fontFamily: "'DM Mono', monospace", letterSpacing: '-1px' }}>{formatCurrency(totalPaid)}</p>
                        </div>
                    )}
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="empty-card">
                    <div style={{ width: 60, height: 60, background: '#f1f5f9', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>📄</div>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '17px', margin: '0 0 8px' }}>No Payment History</p>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You haven't made any payments yet. Your records will appear here.</p>
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="ph-stats-grid">
                        <div className="stat-card one">

                            <p style={{ margin: 0, fontSize: '16px', color: '#495363', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total Payments</p>
                            <p style={{ margin: '6px 0 0', fontSize: '36px', fontWeight: 700, color: '#0f172a', lineHeight: 1, letterSpacing: '-1px' }}>{payments.length}</p>
                            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>transactions recorded</p>
                        </div>

                        <div className="stat-card two">

                            <p style={{ margin: 0, fontSize: '16px', color: '#495363', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total Paid</p>
                            <p style={{ margin: '6px 0 0', fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px', fontFamily: "'DM Mono', monospace" }}>{formatCurrency(totalPaid)}</p>
                            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>lifetime payments</p>
                        </div>

                        <div className="stat-card three">

                            <p style={{ margin: 0, fontSize: '16px', color: '#495363', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Last Payment</p>
                            <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.3px' }}>{formatDate(payments[0].paymentDate)}</p>
                            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>most recent date</p>
                        </div>
                    </div>

                    {/* Section Label */}
                    <div className="ph-section-head">
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Payment Transactions</p>
                        <span style={{ fontSize: '13px', color: '#64748b', background: 'white', border: '1.5px solid #eef0f4', borderRadius: '100px', padding: '4px 14px', fontWeight: 500 }}>
                            {payments.length} records
                        </span>
                    </div>

                    {/* Table Header */}
                    <div className="table-header">
                        {['Payment ID', 'Date', 'Method', 'Amount', ''].map((h, i) => (
                            <span key={i} className="section-title">{h}</span>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="ph-rows" ref={rowsContainerRef}>
                        {payments.map((payment, index) => {
                            const bill = getBillForPayment(payment.billId);
                            const isOpen = selectedPayment?.id === payment.id;
                            const mc = methodConfig(payment.method);
                            const isAnimated = visibleRowIndices.has(index);

                            return (
                                <div key={payment.id} className={`pay-row ${isOpen ? 'active' : ''} ${isAnimated ? 'animated' : ''}`} data-row-index={index}>
                                    <div className="pay-row-main" onClick={() => handlePaymentClick(payment)}>

                                        {/* ID + Status */}
                                        <div className="pay-primary" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div className="pay-avatar">
                                                <svg width="18" height="18" fill="none" stroke="#F2C200" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace", letterSpacing: '0.2px' }}>{payment.id}</p>
                                                <div className="status-pill">
                                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F2C200', display: 'inline-block' }}></span>
                                                    {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="pay-meta">
                                            <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>{formatDate(payment.paymentDate)}</p>
                                            <p className="ref-text">Ref: {payment.referenceNumber || '—'}</p>
                                        </div>

                                        {/* Method */}
                                        <div className="pay-method">
                                            <span className="method-pill" style={{ background: mc.bg, color: mc.color, fontSize: '12.5px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', letterSpacing: '0.1px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                {payment.method}
                                            </span>
                                        </div>

                                        {/* Amount */}
                                        <p className="amount-text pay-amount">{formatCurrency(payment.amount)}</p>

                                        {/* Chevron */}
                                        <div className="chevron-btn pay-chevron">
                                            <svg width="13" height="13" fill="none" stroke={isOpen ? '#2563eb' : '#94a3b8'} strokeWidth="2.2" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Expanded Panel */}
                                    {isOpen && (
                                        <div className="detail-panel">
                                            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Details</p>

                                            <div className="detail-grid">
                                                {[
                                                    ['Bill Period', bill?.billingPeriod || currentAccount?.billingMonth || 'N/A'],
                                                    ['Bill ID', bill?.id || payment.billId || 'N/A'],
                                                    ['Units Consumed', bill?.unitsConsumed ? `${bill.unitsConsumed} kWh` : (currentAccount?.units ? `${currentAccount.units} kWh` : 'N/A')],
                                                    ['Bill Amount', bill?.totalAmount ? formatCurrency(bill.totalAmount) : (currentAccount?.currentBalance ? formatCurrency(currentAccount.currentBalance) : 'N/A')],
                                                    ['Payment Method', payment.method],
                                                    ['Reference No.', payment.referenceNumber || '—'],
                                                ].map(([label, value], i) => (
                                                    <div key={i} className="detail-cell" style={{ paddingRight: '24px' }}>
                                                        <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                                                        <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 600, fontFamily: i >= 4 ? 'inherit' : "'DM Mono', monospace" }}>{value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {bill && (
                                                <div className="detail-actions" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <button className="dl-btn" onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(payment); }}>
                                                        <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Download Receipt
                                                    </button>
                                                    <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>PDF format · Signed receipt</span>
                                                </div>
                                            )}
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