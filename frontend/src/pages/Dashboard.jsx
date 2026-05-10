import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import Alert from '../components/Alert';
import bgImage from '../assets/bulb.jpg';


const Dashboard = () => {
    const {
        currentAccount,
        getLastPayment,
        getNotifications,
        hasOverdueBills
    } = useApp();



    const formatWelcomeName = (name) => {
        if (!name) return 'Customer';

        const normalizedName = name.trim().replace(/\s+/g, ' ');
        const parts = normalizedName.split(' ');

        if (parts.length > 1) {
            const lastName = parts[parts.length - 1];
            const firstParts = parts
                .slice(0, -1)
                .map((part) => (/^[A-Z]{2,}$/.test(part) ? part.split('').join(' ') : part));

            return [...firstParts, lastName].join(' ');
        }

        if (/^[A-Z]{7,}$/.test(normalizedName)) {
            // Handle compact uppercase names like MWGHTKJAYASEKARA.
            const initialsLength = Math.min(6, Math.max(2, normalizedName.length - 9));
            const initials = normalizedName.slice(0, initialsLength).split('').join(' ');
            const lastName = normalizedName.slice(initialsLength);
            return lastName ? `${initials} ${lastName}` : initials;
        }

        return normalizedName;
    };

    const lastPayment = getLastPayment();
    const paymentHistory = currentAccount?.recentPayments && currentAccount.recentPayments.length > 0
        ? currentAccount.recentPayments
        : (lastPayment ? [lastPayment] : []);
    const notifications = getNotifications();
    const totalPaymentAmount = paymentHistory.reduce(
        (sum, payment) => sum + Number(payment.paidAmount ?? payment.amount ?? 0),
        0
    );
    // Calculate due date from billing month (typically 20 days after billing month ends)
    const calculateDueDate = (billingMonth) => {
        if (!billingMonth) return null;

        try {
            // billingMonth format could be "YYYY-MM" or "Month YYYY"
            let date;
            if (billingMonth.includes('-')) {
                // Format: "2026-02"
                const [year, month] = billingMonth.split('-');
                date = new Date(parseInt(year), parseInt(month), 20); // 20th of next month
            } else {
                // Try to parse "February 2026" format
                date = new Date(billingMonth);
                if (!isNaN(date.getTime())) {
                    date.setMonth(date.getMonth() + 1);
                    date.setDate(20);
                }
            }
            return date && !isNaN(date.getTime()) ? date : null;
        } catch (error) {
            console.error('Error parsing billing month:', error);
            return null;
        }
    };

    const dueDate = currentAccount?.billingMonth ? calculateDueDate(currentAccount.billingMonth) : null;

    return (
        <div className="dashboard-page" style={{
            fontFamily: "'Outfit', 'Segoe UI', sans-serif",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '24px',
            position: 'relative'
        }}>
            {/* Semi-transparent overlay for better readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(243, 235, 205, 0.92)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div className="dashboard-shell" style={{ position: 'relative' }}>

                {/* Google Font Import */}
                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

                .dash-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .dash-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
                }
                .stat-card {
                    background: white;
                    border-radius: 20px;
                    padding: 22px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 28px rgba(0,0,0,0.12);
                }
                .icon-box {
                    width: 46px;
                    height: 46px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 16px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #f1f5f9;
                }
                .info-row:last-child { border-bottom: none; }
                .info-label { font-size: 13px; color: #64748b; font-weight: 500; }
                .info-value { font-size: 14px; color: #1e293b; font-weight: 600; }
                .dashboard-hero {
                    background: linear-gradient(135deg, #7A0026 0%, #5C001D 60%, #4D0018 100%);
                    border-radius: 24px;
                    padding: 32px;
                    margin-bottom: 24px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(122,0,38,0.25);
                }
                .dashboard-hero-main {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 24px;
                }
                .dashboard-account-panel {
                    background: rgba(255,255,255,0.12);
                    border-radius: 16px;
                    padding: 20px 24px;
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.2);
                    min-width: 280px;
                }
                .dashboard-overdue {
                    background: #fff7ed;
                    border: 1.5px solid #fed7aa;
                    border-radius: 14px;
                    padding: 14px 18px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .dashboard-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .dashboard-section {
                    max-width: 1200px;
                    margin: 0 auto 24px;
                    padding: 0 12px;
                }
                .last-payment-card {
                    cursor: pointer;
                }
                .last-payment-toggle {
                    margin-top: 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #166534;
                    font-weight: 700;
                }
                .last-payment-details {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #dcfce7;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .payment-transactions {
                    background: #fff;
                    border: 1.5px solid #eef0f4;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    margin-bottom: 24px;
                }
                .payment-transactions-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid #eef0f4;
                    background: #f8fafc;
                }
                .payment-transactions-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr 1fr;
                    gap: 12px;
                    padding: 12px 20px;
                }
                .payment-transactions-grid.head {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    color: #64748b;
                    border-bottom: 1px solid #eef0f4;
                    background: #ffffff;
                }
                .payment-transactions-row {
                    font-size: 14px;
                    color: #1e293b;
                    font-weight: 600;
                    border-bottom: 1px solid #f1f5f9;
                }
                .payment-transactions-row:last-child {
                    border-bottom: none;
                }
                .dashboard-main-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                }
                .dashboard-preview-header {
                    padding: 14px 18px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                .dashboard-preview-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .dashboard-success-alert {
                    position: fixed;
                    top: 5rem;
                    right: 1rem;
                    z-index: 50;
                }

                @media (max-width: 1024px) {
                    .dashboard-page {
                        padding: 20px !important;
                    }
                    .dashboard-hero-main {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .dashboard-account-panel {
                        min-width: 0;
                        width: 100%;
                    }
                    .dashboard-main-grid {
                        grid-template-columns: 1fr;
                    }
                    .dashboard-stats-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 767px) {
                    .dashboard-page {
                        padding: 14px !important;
                        background-attachment: scroll !important;
                    }
                    .dashboard-hero {
                        padding: 22px 18px;
                        border-radius: 20px;
                    }
                    .dashboard-hero-main h1 {
                        font-size: 22px !important;
                        line-height: 1.2;
                    }
                    .dashboard-overdue {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .dashboard-stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .dashboard-preview-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .dashboard-preview-actions {
                        width: 100%;
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .dashboard-preview-actions a,
                    .dashboard-preview-actions button {
                        width: 100%;
                        text-align: center;
                    }
                    .dashboard-success-alert {
                        left: 1rem;
                        right: 1rem;
                        top: auto;
                        bottom: 1rem;
                    }
                    .payment-transactions-head {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    .payment-transactions-grid,
                    .payment-transactions-grid.head {
                        grid-template-columns: 1fr;
                        gap: 6px;
                    }
                    .payment-transactions-grid.head {
                        display: none;
                    }
                    .payment-transactions-row {
                        padding-top: 10px;
                        padding-bottom: 10px;
                    }
                }
            `}</style>

                {/* ── Hero Banner ── */}
                <div className="dashboard-hero">
                    {/* Background Image */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '40%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.15,
                        borderRadius: '0 24px 24px 0'
                    }} />
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ position: 'absolute', bottom: -40, right: 80, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ position: 'absolute', top: 20, right: 200, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                    <div className="dashboard-hero-main">
                        {/* Left Section - Welcome */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>

                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>Electricity Distribution Lanka (Pvt) Ltd</p>
                                    <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                                        Welcome , {formatWelcomeName(currentAccount?.customerName)} !
                                    </h1>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                    Address : {currentAccount?.address || 'Address not available'}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                    {currentAccount?.tariff} Tariff
                                </span>
                                <span style={{ background: currentAccount?.status === 'active' ? 'rgba(245, 227, 65, 0.3)' : 'rgba(248, 243, 200, 0.3)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                    ● {currentAccount?.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Right Section - Account Details */}
                        <div className="dashboard-account-panel">
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Customer Information</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 2px' }}>Customer Name</p>
                                    <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: 0 }}>{currentAccount?.customerName}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 2px' }}>Account Number</p>
                                    <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: 0 }}>{currentAccount?.accountNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Overdue Alert ── */}
                {hasOverdueBills() && (
                    <div className="dashboard-overdue">
                        <svg width="20" height="20" fill="none" stroke="#ea580c" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#9a3412', fontSize: '14px' }}>Overdue Payment</p>
                            <p style={{ margin: 0, color: '#c2410c', fontSize: '13px' }}>You have overdue bills. Please pay to avoid disconnection.</p>
                        </div>
                    </div>
                )}

                {/* ── 4 Stat Cards ── */}
                <div className="dashboard-stats-grid">

                    {/* Current Bill */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#cf1f1f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Bill</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {currentAccount?.currentBalance ? formatCurrency(currentAccount.currentBalance) : 'N/A'}
                        </p>
                        {currentAccount?.billingMonth && (
                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                                {currentAccount.billingMonth}
                            </p>
                        )}

                    </div>

                    {/* Due Date */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#e0ad04', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
                        <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {dueDate ? formatDate(dueDate) : 'N/A'}
                        </p>
                        {currentAccount?.currentBalance > 0 && (
                            <span style={{ display: 'inline-block', marginTop: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                                {currentAccount?.billingMonth || 'This billing period'}
                            </span>
                        )}
                    </div>

                    {/* Last Payment */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#2da316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Payment</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {paymentHistory.length > 0 ? formatCurrency(totalPaymentAmount) : 'None'}
                        </p>
                        {paymentHistory.length > 0 && (
                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                                Noted: Un-Accounted Payment Details Are Subject To Be Confirmed.
                            </p>
                        )}
                    </div>

                </div>

                {paymentHistory.length > 0 && (
                    <div className="payment-transactions">
                        <div className="payment-transactions-head">
                            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Last Payment Details</p>
                            <span style={{ fontSize: '13px', color: '#64748b', background: 'white', border: '1.5px solid #eef0f4', borderRadius: '100px', padding: '4px 14px', fontWeight: 500 }}>
                                {paymentHistory.length} records
                            </span>
                        </div>

                        <div className="payment-transactions-grid head">
                            <span>Date</span>
                            <span>Method</span>
                            <span>Amount (LKR)</span>
                        </div>

                        {paymentHistory.map((payment, index) => (
                            <div key={payment.paymentId || payment.id || index} className="payment-transactions-grid payment-transactions-row">
                                <span>{formatDate(payment.paidDate || payment.paymentDate || payment.date)}</span>
                                <span>{payment.method || 'API Payment'}</span>
                                <span>{new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(payment.paidAmount ?? payment.amount ?? 0))}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Notifications ── */}
                {notifications?.length > 0 && (
                    <div>
                        <p className="section-title">Notifications</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {notifications.slice(0, 3).map((notif) => (
                                <Alert key={notif.id} type={notif.type} title={notif.title} message={notif.message} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;