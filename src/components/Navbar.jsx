import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logoImage from '../assets/ceb-1.png';

const Navbar = () => {
    const { isAuthenticated, currentAccount, logout } = useApp();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinks = [
        { name: 'Home', path: '/dashboard' },
        { name: 'Bill Inquiry', path: '/bills' },
        { name: 'Payment History', path: '/payments' },
    ];

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 no-print border-b-2 border-blue-100">
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
                                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                                    Ceylon Electricity Board
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${isActive(link.path)
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="hidden md:flex md:items-center">
                        <button
                            onClick={logout}
                            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#6B7280] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374151] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
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
                <div className="md:hidden border-t-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
                    <div className="px-2 pt-2 pb-3 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${isActive(link.path)
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t-2 border-blue-100">
                        <div className="px-4 mb-3">
                            <p className="text-base font-semibold text-gray-900">
                                {currentAccount?.customerName}
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                                {currentAccount?.accountNumber}
                            </p>
                        </div>
                        <div className="px-2">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#6B7280] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374151] shadow-md transition-all duration-300"
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
