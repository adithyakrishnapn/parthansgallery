import React from 'react';

const ScrollTop = ({ isVisible }) => {
    
    // This function will be called when the button is clicked
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling animated
        });
    };

    return (
        // The component receives the 'isVisible' prop to control its 'active' class
        <a 
            href="#" 
            onClick={(e) => { 
                e.preventDefault(); // Prevent the link from adding a '#' to the URL
                scrollToTop(); 
            }}
            // The className is dynamic: it's always 'scroll-top', but 'active' is added or removed
            className={`scroll-top d-flex align-items-center justify-content-center ${isVisible ? 'active' : ''}`}
        >
            <i className="bi bi-arrow-up-short"></i>
        </a>
    );
};

export default ScrollTop;