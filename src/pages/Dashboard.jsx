import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { buildPrintableBill, formatCurrency, formatDate, generateBillPDFPreview, getStatusColor } from '../utils/helpers';
import BillCard from '../components/BillCard';
import Alert from '../components/Alert';
import PaymentModal from '../components/PaymentModal';
import logoImage from '../assets/ceb-1.png';
import bgImage from '../assets/bulb.jpg';


const Dashboard = () => {
    const {
        currentAccount,
        getCurrentBill,
        getLastPayment,
        getPaymentHistory,
        getNotifications,
        hasOverdueBills
    } = useApp();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [billPreviewUrl, setBillPreviewUrl] = useState('');
    const [billPreviewFileName, setBillPreviewFileName] = useState('');

    const currentBill = getCurrentBill();
    const lastPayment = getLastPayment();
    const paymentHistory = getPaymentHistory();
    const notifications = getNotifications();

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

    // Get last payment from API data if available
    const lastPaymentFromAPI = currentAccount?.recentPayments && currentAccount.recentPayments.length > 0
        ? currentAccount.recentPayments[0]
        : null;

    const handlePaymentSuccess = (paymentInfo) => {
        setShowPaymentModal(false);
        setPaymentSuccess(true);
        // Hide success message after 5 seconds
        setTimeout(() => setPaymentSuccess(false), 5000);
    };

    useEffect(() => {
        return () => {
            if (billPreviewUrl) {
                URL.revokeObjectURL(billPreviewUrl);
            }
        };
    }, [billPreviewUrl]);

    const handlePrintCurrentBill = () => {
        if (!currentAccount) return;

        const printableBill = buildPrintableBill(currentAccount);
        const previewData = generateBillPDFPreview(printableBill, currentAccount);

        if (billPreviewUrl) {
            URL.revokeObjectURL(billPreviewUrl);
        }

        setBillPreviewUrl(URL.createObjectURL(previewData.blob));
        setBillPreviewFileName(previewData.fileName);
    };

    const closeBillPreview = () => {
        if (billPreviewUrl) {
            URL.revokeObjectURL(billPreviewUrl);
        }
        setBillPreviewUrl('');
        setBillPreviewFileName('');
    };

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
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .dashboard-actions-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .dashboard-actions-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                }
                .dashboard-section {
                    max-width: 1200px;
                    margin: 0 auto 24px;
                    padding: 0 12px;
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
                    .dashboard-actions-head {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .dashboard-actions-grid {
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
                                        Welcome, {currentAccount?.customerName?.split(' ')}!
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
                                <span style={{ background: currentAccount?.status === 'active' ? 'rgba(245, 227, 65, 0.3)' : 'rgba(248, 243, 200, 0.3)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                    ● {currentAccount?.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Right Section - Account Details */}
                        <div className="dashboard-account-panel">
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
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#edc33a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
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
                            {currentAccount?.lastPaymentAmount
                                ? formatCurrency(currentAccount.lastPaymentAmount)
                                : lastPaymentFromAPI
                                    ? formatCurrency(lastPaymentFromAPI.paidAmount || lastPaymentFromAPI.amount || 0)
                                    : lastPayment
                                        ? formatCurrency(lastPayment.amount)
                                        : 'None'
                            }
                        </p>
                        {(currentAccount?.lastPaymentDate || lastPaymentFromAPI || lastPayment) && (
                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                                {currentAccount?.lastPaymentDate
                                    ? formatDate(currentAccount.lastPaymentDate)
                                    : lastPaymentFromAPI
                                        ? formatDate(lastPaymentFromAPI.paidDate || lastPaymentFromAPI.paymentDate || lastPaymentFromAPI.date || new Date())
                                        : formatDate(lastPayment.paymentDate)
                                }
                            </p>
                        )}
                    </div>

                    {/* Units Used */}
                    <div className="stat-card">
                        <p style={{ margin: '0 0 8px', fontSize: '16px', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Units Used</p>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                            {currentAccount?.units
                                ? <>{currentAccount.units} <span style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8' }}>kWh</span></>
                                : currentBill?.units
                                    ? <>{currentBill.units} <span style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8' }}>kWh</span></>
                                    : 'N/A'
                            }
                        </p>
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                            {currentAccount?.billingMonth || 'This billing period'}
                        </p>
                    </div>
                </div>

                {/* ── Quick Actions - Horizontal ── */}
                <div className="dashboard-section">
                    <div className="dashboard-actions-head">
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(135deg, #F2C200, #d9af00)', borderRadius: '2px' }} />
                            Quick Actions
                        </h2>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Payments and bill access</p>
                    </div>

                    <div className="dashboard-actions-grid">

                        {/* Last Bill Payment */}
                        <Link to="/payments" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fdf0f0 0%, #fcdcdc 100%)',
                                borderRadius: '20px',
                                padding: '26px',
                                border: '2px solid #913434',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%',
                                minHeight: '138px'
                            }} className="dash-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #a31616, #801535)',
                                        borderRadius: '16px',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(163, 22, 22, 0.3)'
                                    }}>
                                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, color: '#531414', fontSize: '18px', lineHeight: '1.3' }}>Last Bill Payment</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#c52222', fontWeight: 600 }}>View live payment transactions from the account</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Pay Now or Print Bill */}
                        {currentBill && !currentBill.isPaid ? (
                            <div
                                onClick={() => setShowPaymentModal(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #7A0026 0%, #5C001D 100%)',
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
                            <button
                                type="button"
                                onClick={handlePrintCurrentBill}
                                style={{ textDecoration: 'none', border: 'none', padding: 0, background: 'transparent', width: '100%', textAlign: 'left' }}
                            >
                                <div style={{
                                    background: 'linear-gradient(135deg, #fffef7 0%, #fffaeb 100%)',
                                    borderRadius: '20px',
                                    padding: '26px',
                                    border: '2px solid #fcd34d',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    height: '100%',
                                    minHeight: '138px'
                                }} className="dash-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #F2C200, #d9af00)',
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
                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#d97706', fontWeight: 600 }}>Preview and download the current bill PDF</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Main Grid ── */}
                <div className="dashboard-section">
                    <div className="dashboard-main-grid">

                        {/* Billing Details */}
                        <div className="dash-card">
                            <p className="section-title">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    Last Billing Details
                                </span>
                            </p>

                            {paymentHistory.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {paymentHistory.map((payment) => (
                                        <div key={payment.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fdf0f9', borderRadius: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a38216', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', color: '#282f3a', flex: 1 }}>{formatDate(payment.paymentDate)}</span>
                                            <span style={{ fontWeight: 700, color: '#a38216', fontSize: '14px' }}>{formatCurrency(payment.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#94a3b8', fontSize: '13px' }}>No payments available</p>
                            )}
                        </div>

                        {/* Meter Readings */}
                        <div className="dash-card">
                            <p className="section-title">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    Meter Readings
                                </span>
                            </p>

                            {currentAccount?.units ? (
                                <div className="info-row">
                                    <span className="info-label">Units Used</span>
                                    <span className="info-value">{currentAccount.units} kWh</span>
                                </div>
                            ) : (
                                <p style={{ color: '#94a3b8', fontSize: '13px' }}>No meter readings available</p>
                            )}

                        </div>
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
                    <div className="dashboard-success-alert animate-fadeIn">
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

                {billPreviewUrl && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            width: 'min(980px, 100%)',
                            height: 'min(90vh, 860px)',
                            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.35)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <div className="dashboard-preview-header">
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Bill Preview</h3>
                                <div className="dashboard-preview-actions">
                                    <a
                                        href={billPreviewUrl}
                                        download={billPreviewFileName || 'CEB_Bill.pdf'}
                                        style={{
                                            background: 'linear-gradient(135deg, #7A0026, #5C001D)',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            borderRadius: '10px',
                                            padding: '9px 16px',
                                            fontSize: '14px',
                                            fontWeight: 700
                                        }}
                                    >
                                        Download PDF
                                    </a>
                                    <button
                                        type="button"
                                        onClick={closeBillPreview}
                                        style={{
                                            border: '1px solid #cbd5e1',
                                            background: '#fff',
                                            color: '#334155',
                                            borderRadius: '10px',
                                            padding: '9px 16px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <iframe
                                title="Bill PDF Preview"
                                src={billPreviewUrl}
                                style={{ border: 'none', width: '100%', height: '100%', background: '#f8fafc' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;