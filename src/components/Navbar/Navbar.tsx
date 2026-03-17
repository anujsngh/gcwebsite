import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/images/logo_gc_new.png";
import logo_iitk from "../../assets/images/logo-iitk.png";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    // Focus trap + Escape key handler for mobile menu
    useEffect(() => {
        if (!menuOpen) return;

        const menuEl = menuRef.current;
        if (!menuEl) return;

        const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
            menuEl.querySelectorAll<HTMLElement>(focusableSelectors)
        );

        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        // Focus first item when menu opens
        firstEl.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                toggleButtonRef.current?.focus();
                return;
            }

            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        setMenuOpen(false);
        navigate(path);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/events", label: "Events" },
        { path: "/competitions", label: "Competitions" },
        { path: "/blogs", label: "Blogs" },
        { path: "/surveys", label: "Surveys" },
        { path: "/support", label: "Support" },
        { path: "/icc", label: "ICC" },
        { path: "/resources", label: "Resources" },
    ];

    return (
        <nav aria-label="Main navigation" className="flex items-center justify-between bg-base-100 shadow-md sticky top-0 z-50 px-4 sm:px-10 py-2 gap-4 max-w-full">
            {/* Left section: Gender Cell Logo and Text */}
            <div className="flex items-center gap-2 flex-none">
                <div className="relative lg:hidden" ref={menuRef}>
                    <button
                        ref={toggleButtonRef}
                        className="btn btn-ghost"
                        onClick={toggleMenu}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav-menu"
                        aria-haspopup="true"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </button>
                    {menuOpen && (
                        <ul
                            id="mobile-nav-menu"
                            role="menu"
                            className="menu menu-sm absolute left-0 mt-3 z-[60] p-2 shadow-lg bg-base-100 rounded-box w-52"
                        >
                            {navLinks.map((link) => (
                                <li key={link.path} role="none">
                                    <Link
                                        to={link.path}
                                        role="menuitem"
                                        className={location.pathname === link.path ? "active-link" : "nav-link"}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                        aria-current={location.pathname === link.path ? "page" : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Link to="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center gap-2">
                    <img src={logo} className="max-w-10 sm:max-w-12 w-auto" alt="Gender Cell Logo" />
                    <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text font-heading whitespace-nowrap">
                        Gender Cell
                    </span>
                </Link>
            </div>

            {/* Spacer */}
            <div className="flex-1 hidden lg:block min-w-4" aria-hidden="true"></div>

            {/* Center section: Desktop Navigation Links */}
            <div className="hidden lg:flex flex-none">
                <ul className="menu menu-horizontal px-1 gap-4" role="list">
                    {navLinks.map((link) => (
                        <li key={link.path} role="none">
                            <Link
                                to={link.path}
                                className={location.pathname === link.path ? "active-link" : "nav-link"}
                                onClick={(e) => handleNavClick(e, link.path)}
                                aria-current={location.pathname === link.path ? "page" : undefined}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Spacer */}
            <div className="flex-1 hidden lg:block min-w-4" aria-hidden="true"></div>

            {/* Right section: IITK Logo */}
            <div className="flex-none">
                <a href="https://www.iitk.ac.in/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle avatar" aria-label="Visit IIT Kanpur website (opens in new tab)">
                    <div className="w-10 rounded-full">
                        <img alt="IIT Kanpur Logo" src={logo_iitk} className="!object-contain w-full h-full" />
                    </div>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
