import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import BillCard from '../components/BillCard';
import Alert from '../components/Alert';
import PaymentModal from '../components/PaymentModal';
import logoImage from '../assets/ceb-1.png';
import bgImage from '../assets/ceb.jpg';


const Dashboard = () => {
    const {
        currentAccount,
        getCurrentBill,
        getLastPayment,
        getNotifications,
        hasOverdueBills
    } = useApp();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const currentBill = getCurrentBill();
    const lastPayment = getLastPayment();
    const notifications = getNotifications();

    const handlePaymentSuccess = (paymentInfo) => {
        setShowPaymentModal(false);
        setPaymentSuccess(true);
        // Hide success message after 5 seconds
        setTimeout(() => setPaymentSuccess(false), 5000);
    };

    return (
        <div style={{
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
                background: 'rgba(240, 244, 248, 0.92)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>

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
            `}</style>

                {/* ── Hero Banner ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #0ea5e9 100%)',
                    borderRadius: '24px',
                    padding: '32px',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(29,78,216,0.25)'
                }}>
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

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                        {/* Left Section - Welcome */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>

                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>Ceylon Electricity Board</p>
                                    <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                                        Welcome, {currentAccount?.customerName?.split(' ')[0]}!
                                    </h1>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                    Acc: {currentAccount?.accountNumber}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                    {currentAccount?.tariff} Tariff
                                </span>
                                <span style={{ background: currentAccount?.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                    ● {currentAccount?.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Right Section - Account Details */}
                        <div style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: '16px',
                            padding: '20px 24px',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            minWidth: '280px'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Account Details</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 2px' }}>Customer Name</p>
                                    <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: 0 }}>{currentAccount?.customerName}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 2px' }}>Account Number</p>
                                    <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: 0 }}>{currentAccount?.accountNumber}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 2px' }}>Contact</p>
                                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0 }}>{currentAccount?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Overdue Alert ── */}
                {hasOverdueBills() && (
                    <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>

                    {/* Current Bill */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Bill</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {currentBill ? formatCurrency(currentBill.totalAmount) : 'N/A'}
                        </p>
                        <Link to="/bills" style={{ display: 'inline-block', marginTop: '12px', fontSize: '13px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View bill →</Link>
                    </div>

                    {/* Due Date */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
                        <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {currentBill ? formatDate(currentBill.dueDate) : 'N/A'}
                        </p>
                        {currentBill && !currentBill.isPaid && (
                            <span style={{ display: 'inline-block', marginTop: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Unpaid</span>
                        )}
                    </div>

                    {/* Last Payment */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Payment</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {lastPayment ? formatCurrency(lastPayment.amount) : 'None'}
                        </p>
                        {lastPayment && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{formatDate(lastPayment.paymentDate)}</p>}
                    </div>

                    {/* Units Used */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Units Used</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {currentBill?.units ?? 'N/A'} <span style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8' }}>kWh</span>
                        </p>
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>This billing period</p>
                    </div>
                </div>

                {/* ── Quick Actions - Horizontal ── */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '24px', background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: '2px' }} />
                        Quick Actions
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {/* View Bills */}
                        <Link to="/bills" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                borderRadius: '20px',
                                padding: '24px',
                                border: '2px solid #bfdbfe',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }} className="dash-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                        borderRadius: '16px',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                                    }}>
                                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, color: '#1e3a8a', fontSize: '18px', lineHeight: '1.3' }}>View Bills</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#3b82f6', fontWeight: 500 }}>All billing history & details</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Payment History */}
                        <Link to="/payments" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                borderRadius: '20px',
                                padding: '24px',
                                border: '2px solid #bbf7d0',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }} className="dash-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                        borderRadius: '16px',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
                                    }}>
                                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, color: '#14532d', fontSize: '18px', lineHeight: '1.3' }}>Payment History</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#22c55e', fontWeight: 500 }}>View past transactions</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Pay Now or Print Bill */}
                        {currentBill && !currentBill.isPaid ? (
                            <div
                                onClick={() => setShowPaymentModal(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #0A2540 0%, #0052CC 100%)',
                                    borderRadius: '20px',
                                    padding: '24px',
                                    border: '2px solid #0ec8e9',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(29, 188, 216, 0.4)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%'
                                }}
                                className="dash-card"
                            >
                                {/* Shine effect */}
                                <div style={{ position: 'absolute', top: -10, right: -10, width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent)', pointerEvents: 'none' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.25)',
                                        borderRadius: '16px',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(8px)'
                                    }}>
                                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, color: 'white', fontSize: '18px', lineHeight: '1.3' }}>Pay Now</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
                                            {formatCurrency(currentBill.totalAmount)} due
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/bills" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                    borderRadius: '20px',
                                    padding: '24px',
                                    border: '2px solid #fcd34d',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    height: '100%'
                                }} className="dash-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            borderRadius: '16px',
                                            width: '56px',
                                            height: '56px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                                        }}>
                                            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 800, color: '#78350f', fontSize: '18px', lineHeight: '1.3' }}>Print Bill</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#d97706', fontWeight: 500 }}>Download or print bills</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Main Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', maxWidth: '1200px', margin: '0 auto 24px' }}>

                    {/* Billing Details */}
                    <div className="dash-card">
                        <p className="section-title">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Last Billing Details
                            </span>
                        </p>
                        {currentBill ? (
                            <>
                                <div className="info-row">
                                    <span className="info-label">Billing Days</span>
                                    <span className="info-value">{currentBill.days ?? 'N/A'} days</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Units Consumed</span>
                                    <span className="info-value">{currentBill.units ?? 'N/A'} kWh</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">KWH Charge</span>
                                    <span className="info-value">{formatCurrency(currentBill.kwhCharge ?? currentBill.energyCharge ?? 0)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">SSCL</span>
                                    <span className="info-value">{formatCurrency(currentBill.sscl ?? 0)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Interest</span>
                                    <span className="info-value">{formatCurrency(currentBill.interest ?? 0)}</span>
                                </div>
                                <div className="info-row" style={{ borderBottom: 'none', paddingTop: '14px', marginTop: '4px', borderTop: '2px solid #e2e8f0' }}>
                                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>Total Amount</span>
                                    <span style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '18px' }}>{formatCurrency(currentBill.totalAmount)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">A/C Balance</span>
                                    <span style={{ fontWeight: 700, color: currentBill.balance > 0 ? '#dc2626' : '#16a34a', fontSize: '15px' }}>
                                        {formatCurrency(currentBill.balance ?? currentBill.totalAmount)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>No billing data available</p>
                        )}
                    </div>

                    {/* Meter Readings */}
                    <div className="dash-card">
                        <p className="section-title">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Meter Readings
                            </span>
                        </p>

                        {/* Visual meter bar */}
                        {currentBill && (
                            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>PREVIOUS</p>
                                        <p style={{ margin: '4px 0 2px', fontSize: '22px', fontWeight: 800, color: '#475569' }}>{currentBill.previousReading ?? 'N/A'}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{currentBill.previousReadingDate ? formatDate(currentBill.previousReadingDate) : ''}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="28" height="28" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontWeight: 700 }}>
                                            +{currentBill.units ?? '—'} kWh
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>LATEST</p>
                                        <p style={{ margin: '4px 0 2px', fontSize: '22px', fontWeight: 800, color: '#1d4ed8' }}>{currentBill.currentReading ?? 'N/A'}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{currentBill.currentReadingDate ? formatDate(currentBill.currentReadingDate) : ''}</p>
                                    </div>
                                </div>
                                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, #7c3aed, #2563eb)', borderRadius: '10px' }} />
                                </div>
                            </div>
                        )}

                        {/* Payment history */}
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Payments</p>
                        {lastPayment ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f0fdf4', borderRadius: '10px', marginBottom: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                                    <span style={{ fontSize: '13px', color: '#374151', flex: 1 }}>{formatDate(lastPayment.paymentDate)}</span>
                                    <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '14px' }}>{formatCurrency(lastPayment.amount)}</span>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#94a3b8', fontSize: '13px' }}>No payment history</p>
                        )}
                    </div>
                </div>

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

                {/* Payment Success Alert */}
                {paymentSuccess && (
                    <div className="fixed top-20 right-4 z-50 animate-fadeIn">
                        <div className="bg-green-50 border-2 border-green-500 rounded-xl shadow-xl p-4 max-w-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-semibold text-green-800">Payment Successful!</h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your payment of {currentBill && formatCurrency(currentBill.totalAmount)} has been processed successfully.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPaymentSuccess(false)}
                                    className="ml-auto flex-shrink-0 text-green-600 hover:text-green-800"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {currentBill && (
                    <PaymentModal
                        isOpen={showPaymentModal}
                        onClose={() => setShowPaymentModal(false)}
                        bill={currentBill}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;