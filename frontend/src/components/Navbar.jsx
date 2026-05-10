import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logoImage from '../assets/ceb-1.png';

const Navbar = () => {
    const { isAuthenticated, currentAccount, logout } = useApp();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-white/95 shadow-lg sticky top-0 z-50 no-print border-b border-accent-200 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src={logoImage}
                                    alt="CEB Logo"
                                    className="h-10 w-auto object-contain"
                                />
                                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent hidden sm:block">
                                    Electricity Distribution Lanka (Pvt) Ltd
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="hidden md:flex md:items-center">
                        <button
                            onClick={logout}
                            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-primary-600 transition-all duration-300"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t-2 border-accent-200 bg-gradient-to-br from-white to-amber-50">
                    <div className="pt-4 pb-3 border-t-2 border-accent-200">
                        <div className="px-4 mb-3">
                            <p className="text-base font-semibold text-gray-900">
                                {currentAccount?.customerName}
                            </p>
                            <p className="text-sm text-primary-600 font-medium">
                                {currentAccount?.accountNumber}
                            </p>
                        </div>
                        <div className="px-2">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-md transition-all duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
