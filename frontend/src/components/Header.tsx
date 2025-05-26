import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiInfo, FiMessageSquare, FiLayers, FiSettings, FiTool, FiHome, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../../styles/global.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Navigation items with icons
    const navItems = [
        { name: 'Home', icon: <FiHome />, path: '/' },
        { name: 'Features', icon: <FiSettings />, path: '/features' },
        { name: 'Examples', icon: <FiLayers />, path: '/examples' },
        // { name: 'Contact', icon: <FiMail />, path: '/contact' },
        { name: 'Build', icon: <FiTool />, path: '/build' },
        { name: 'Feedback', icon: <FiMessageSquare />, path: '/feedback' }
    ];


    // Check screen size and update state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Styles
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
        padding: '1rem 0',
        borderBottom: '1px solid #f0f2f5',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    };

    const containerStyle: React.CSSProperties = {

        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const logoStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
    };

    const logoTextStyle: React.CSSProperties = {
        color: '#2563eb',
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.025em'
    };

    const desktopNavStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
    };

    const mobileMenuButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#4b5563',
        fontSize: '1.5rem',
        display: isMobile ? 'block' : 'none',
    };

    const mobileMenuStyle: React.CSSProperties = {
        position: 'fixed',
        top: '4.5rem',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: isMenuOpen && isMobile ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 999,
        borderBottom: '1px solid #f0f2f5',
    };

    const navItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#4b5563',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        padding: '1rem 0',
        transition: 'color 0.2s ease',
    };

    const navItemHoverStyle: React.CSSProperties = {
        color: '#2563eb',
    };

    const activeNavItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        padding: '1rem 0',
        color: '#2563eb',
    };


    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                <div className="d-flex align-items-center g-2">
                    <FiGrid className="text-primary mr-2" size={24} />
                    <span className="fs-4 fw-bold text-primary m-2">React DataGrid</span>
                </div>


                {/* Desktop Navigation */}
                <nav style={isMobile ? { display: 'none' } : desktopNavStyle}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={item.path === location.pathname ? activeNavItemStyle : navItemStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                            onMouseLeave={(e) => e.currentTarget.style.color = item.path === location.pathname ? '#2563eb' : '#4b5563'}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div>
                    <span className="demo-badge">
                        Demo Version
                    </span>
                </div>

                {/* Mobile Menu Button */}
                <button
                    style={mobileMenuButtonStyle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div style={mobileMenuStyle}>
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        style={{ ...navItemStyle, padding: '0.75rem 0' }}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>

        </header>
    );
};

export default Header;