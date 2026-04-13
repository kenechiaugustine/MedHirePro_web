import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Define navigation links for easy mapping and maintainability
    const navLinks = [
        { name: 'For Professionals', path: '/professional' },
        { name: 'For Institutes', path: '/institute' },
        { name: 'About us', path: '/about' },
        { name: 'Contact us', path: '/contact' },
    ];

    return (
        <nav className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50">
            {/* Desktop & Tablet Container */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Left Side: Logo & Main Navigation */}
                    <div className="flex items-center gap-10 lg:gap-14">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-[#0d47a1] font-bold text-xl tracking-tight">
                                MedHirePro
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex space-x-6 lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-slate-600 hover:text-[#0d47a1] font-medium text-[15px] transition-colors duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link
                            to="/login"
                            className="text-[#334155] hover:text-[#0d47a1] font-semibold text-[15px] transition-colors duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-[#0b5cd5] hover:bg-[#094bb3] text-white px-6 py-2.5 rounded-md font-medium text-[15px] transition-colors duration-200 shadow-sm"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile menu button (Hamburger) */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon switches between Hamburger and Close based on state */}
                            {!isMobileMenuOpen ? (
                                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel (Slide down) */}
            <div
                className={`md:hidden absolute w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible top-[80px]' : 'opacity-0 invisible -top-full'
                    }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:text-[#0d47a1] hover:bg-blue-50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Mobile Auth Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 px-3">
                        <Link
                            to="/login"
                            className="block text-center w-full text-slate-700 hover:text-[#0d47a1] font-semibold py-2.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block text-center w-full bg-[#0b5cd5] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#094bb3] transition-colors shadow-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;