import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// This is now our master list of all possible links for the homepage
const homepageNavLinks = [
    { href: '/#hero', text: 'Home', type: 'hash' },
    { href: '/#about', text: 'About', type: 'hash' },
    { href: '/#resume', text: 'Resume', type: 'hash' },
    { href: '/#services', text: 'Services', type: 'hash' },
    { href: '/#portfolio', text: 'Portfolio', type: 'hash' },
    { href: '/#contact', text: 'Contact', type: 'hash' },
    { href: '/gallery', text: 'Gallery', type: 'page' },
];

// This is the simplified list for the gallery page
const galleryPageNavLinks = [
    { href: '/', text: 'Home', type: 'page' }, // On gallery page, 'Home' should be a direct link to '/'
    { href: '/gallery', text: 'Gallery', type: 'page' },
];


const Header = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    // React Router hooks
    const location = useLocation();
    const navigate = useNavigate();

    // --- Determine which set of links to use based on the current page ---
    const navLinks = location.pathname === '/gallery' ? galleryPageNavLinks : homepageNavLinks;

    // This large effect handles all header behavior
    useEffect(() => {
        // Scrollspy Logic (only for homepage)
        const handleScrollSpy = () => {
            if (location.pathname === '/') {
                let currentSection = '';
                homepageNavLinks.forEach(link => { // Always check against the full list for section IDs
                    if (link.type === 'hash') {
                        const sectionId = link.href.split('#')[1];
                        const section = document.getElementById(sectionId);
                        if (section && window.scrollY >= section.offsetTop - 150) {
                            currentSection = link.href;
                        }
                    }
                });
                setActiveLink(currentSection || '/#hero');
            }
        };
        
        // General Scroll Handler
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
            handleScrollSpy();
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // --- Active Link Logic ---
        // This is now simpler. We check the current page path against our dynamic navLinks.
        const currentPath = location.pathname + location.hash;
        if (location.pathname === '/gallery') {
            setActiveLink('/gallery');
        } else if (location.pathname === '/') {
            setActiveLink(currentPath === '/' ? '/#hero' : `/${location.hash}`);
        }

        // Mobile Nav Body Class
        document.body.classList.toggle('mobile-nav-active', isMobileNavOpen);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('mobile-nav-active');
        };
    }, [isMobileNavOpen, location]); // Re-run when mobile nav or location changes

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    // Smart Navigation Handler
    const handleNavLinkClick = (e, link) => {
        e.preventDefault();

        if (isMobileNavOpen) {
            toggleMobileNav();
        }

        if (link.type === 'page') {
            navigate(link.href);
        } else if (link.type === 'hash') {
            const hash = `#${link.href.split('#')[1]}`;
            if (location.pathname === '/') {
                document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/', { state: { scrollTo: hash } });
            }
        }
    };

    return (
        <header id="header" className={`header d-flex align-items-center fixed-top ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container-fluid position-relative d-flex align-items-center justify-content-between">
                <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0">
                    <h1 className="sitename">Laura</h1>
                </Link>

                <nav id="navmenu" className={`navmenu ${isMobileNavOpen ? 'navmenu-active' : ''}`}>
                    <ul>
                        {/* The component now maps over the dynamically chosen 'navLinks' array */}
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link
                                    to={link.href}
                                    className={activeLink === link.href ? 'active' : ''}
                                    onClick={(e) => handleNavLinkClick(e, link)}
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
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
};

export default Header;