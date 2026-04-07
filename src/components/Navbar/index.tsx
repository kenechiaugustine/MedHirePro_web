import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WEBSITE_ROUTES } from "../../pages/website/routes.enum";

const navLinks = [
    { label: "Home", path: WEBSITE_ROUTES.HOME },
    { label: "About", path: WEBSITE_ROUTES.ABOUT },
    { label: "Contact", path: WEBSITE_ROUTES.CONTACT },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to={WEBSITE_ROUTES.HOME}
                    className="flex items-center gap-2 select-none"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
                        M
                    </span>
                    <span className="text-slate-900 font-semibold text-base tracking-tight">
                        Med<span className="text-blue-600">HirePro</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                isActive(path)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* CTA + Mobile toggle */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/user/dashboard"
                        className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Get Started
                    </Link>

                    {/* Hamburger */}
                    <button
                        onClick={() => setIsOpen((o) => !o)}
                        className="md:hidden flex flex-col justify-center items-center h-9 w-9 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                                isOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                                isOpen ? "opacity-0" : "opacity-100"
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                                isOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
                    isOpen ? "max-h-64 border-t border-slate-100" : "max-h-0"
                }`}
            >
                <nav className="flex flex-col gap-1 px-4 py-3">
                    {navLinks.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setIsOpen(false)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive(path)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        to="/user/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="mt-2 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </nav>
            </div>
        </header>
    );
}