import React from 'react';
import logoImage from '../assets/ceb-1.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white mt-auto no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* About */}
                    <div className="md:pr-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 text-center sm:text-left">
                            <img src={logoImage} alt="EDL" className="h-12 w-auto object-contain drop-shadow-lg mx-auto sm:mx-0" />
                            <h3 className="text-lg font-semibold">Electricity Distribution Lanka (Pvt) Ltd</h3>
                        </div>
                        <p className="text-gray-300 text-sm text-center sm:text-left">
                            Providing reliable and efficient electricity services to customers across Sri Lanka.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="md:justify-self-end md:max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Hotline: 1987
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@edl.lk
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>No. 50, Sir Chittampalam A. Gardiner Mawatha, Colombo 02</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-primary-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} Electricity Distribution Lanka (Pvt) Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
