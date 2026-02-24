import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BillInquiry from './pages/BillInquiry';
import PaymentHistory from './pages/PaymentHistory';
import PrintBill from './pages/PrintBill';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Login />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/bills"
                                element={
                                    <ProtectedRoute>
                                        <BillInquiry />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/payments"
                                element={
                                    <ProtectedRoute>
                                        <PaymentHistory />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/print-bill/:billId"
                                element={
                                    <ProtectedRoute>
                                        <PrintBill />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all - redirect to login */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
