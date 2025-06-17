import React, { useState, useEffect } from 'react';

const navLinks = [
    { href: '#hero', text: 'Home' },
    { href: '#about', text: 'About' },
    { href: '#resume', text: 'Resume' },
    { href: '#services', text: 'Services' },
    { href: '#portfolio', text: 'Portfolio' },
    {
        text: 'Dropdown',
        isDropdown: true,
        submenu: [
            { href: '#', text: 'Dropdown 1' },
            {
                text: 'Deep Dropdown',
                isDropdown: true,
                submenu: [
                    { href: '#', text: 'Deep Dropdown 1' },
                    { href: '#', text: 'Deep Dropdown 2' },
                    { href: '#', text: 'Deep Dropdown 3' },
                    { href: '#', text: 'Deep Dropdown 4' },
                    { href: '#', text: 'Deep Dropdown 5' },
                ],
            },
            { href: '#', text: 'Dropdown 2' },
            { href: '#', text: 'Dropdown 3' },
            { href: '#', text: 'Dropdown 4' },
        ],
    },
    { href: '#contact', text: 'Contact' },
];


const Header = () => {
    // --- 2. State Management using React Hooks ---
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [openDropdowns, setOpenDropdowns] = useState({}); // To manage dropdown state

    // --- 3. useEffect for all side effects (event listeners, etc.) ---
    useEffect(() => {
        // Function to handle scroll events for scrollspy
        const handleScroll = () => {
            let currentSection = '';
            navLinks.forEach(link => {
                if (link.href) {
                    const section = document.querySelector(link.href);
                    if (section && window.scrollY >= section.offsetTop - 150) {
                        currentSection = link.href;
                    }
                }
            });
            setActiveSection(currentSection);
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Add/remove class to body for mobile nav
        if (isMobileNavOpen) {
            document.body.classList.add('mobile-nav-active');
        } else {
            document.body.classList.remove('mobile-nav-active');
        }

        // Cleanup function to remove event listeners and classes
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('mobile-nav-active');
        };
    }, [isMobileNavOpen]); // Rerun this effect only when mobile nav state changes

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    const toggleDropdown = (dropdownKey) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [dropdownKey]: !prev[dropdownKey]
        }));
    };

    const renderNavLinks = (links, level = 0) => {
        return links.map((link, index) => {
            const dropdownKey = `${level}-${index}`;
            if (link.isDropdown) {
                return (
                    <li key={dropdownKey} className={`dropdown ${openDropdowns[dropdownKey] ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown(dropdownKey); }}>
                            <span>{link.text}</span>
                            <i className="bi bi-chevron-down toggle-dropdown"></i>
                        </a>
                        <ul className={openDropdowns[dropdownKey] ? 'dropdown-active' : ''}>
                            {renderNavLinks(link.submenu, level + 1)}
                        </ul>
                    </li>
                );
            }
            return (
                <li key={link.href}>
                    <a href={link.href} className={activeSection === link.href ? 'active' : ''} onClick={() => isMobileNavOpen && toggleMobileNav()}>
                        {link.text}
                    </a>
                </li>
            );
        });
    };

    return (
        <header id="header" className="header d-flex align-items-center fixed-top">
            <div className="container-fluid position-relative d-flex align-items-center justify-content-between">
                <a href="/" className="logo d-flex align-items-center me-auto me-xl-0">
                    <h1 className="sitename">Laura</h1>
                </a>

                <nav id="navmenu" className={`navmenu ${isMobileNavOpen ? 'navmenu-active' : ''}`}>
                    <ul>
                        {renderNavLinks(navLinks)}
                    </ul>
                    <i
                        className={`mobile-nav-toggle d-xl-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
                        onClick={toggleMobileNav}
                    ></i>
                </nav>

                <div className="header-social-links">
                    <a href="#" className="twitter"><i className="bi bi-twitter-x"></i></a>
                    <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                </div>
            </div>
        </header>
    );
}

export default Header;