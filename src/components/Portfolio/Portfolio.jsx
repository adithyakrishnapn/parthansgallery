import React, { useState, useEffect, useRef } from 'react';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db }  from '../../config/firebaseconfig';
import { Link } from 'react-router-dom';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

import './Portfolio.css'; 

const Portfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState('*');
    const [loading, setLoading] = useState(true);

    const isotopeContainer = useRef(null);
    const isotope = useRef(null);

    useEffect(() => {
        const categoriesQuery = query(collection(db, "categories"), orderBy("name"));
        const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
            const fetchedCategories = snapshot.docs.map(doc => {
                const name = doc.data().name;
                const key = `.filter-${name.toLowerCase().replace(/\s+/g, '-')}`;
                return { name, key };
            });
            setCategories([{ name: 'All', key: '*' }, ...fetchedCategories]);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setLoading(true);
        const portfolioCollectionRef = collection(db, 'portfolio');
        const portfolioQuery = query(
            portfolioCollectionRef,
            orderBy('createdAt', 'desc'),
            limit(12)
        );
        const unsubscribe = onSnapshot(portfolioQuery, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => {
                const data = doc.data();
                const filterClass = `filter-${data.categoryName.toLowerCase().replace(/\s+/g, '-')}`;
                return { id: doc.id, ...data, filterClass };
            });
            setPortfolioItems(fetchedItems);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && portfolioItems.length > 0) {
            
            // Wait for images to load before initializing Isotope
            imagesLoaded(isotopeContainer.current, () => {
                isotope.current = new Isotope(isotopeContainer.current, {
                    itemSelector: '.portfolio-item',
                    layoutMode: 'masonry',
                });
            });

            const lightbox = GLightbox({
                selector: '.glightbox' // It will now find the dynamically rendered links
            });

            return () => {
                if (isotope.current) {
                    isotope.current.destroy();
                }
                lightbox.destroy(); // Destroy the GLightbox instance to prevent memory leaks
            };
        }
    }, [loading, portfolioItems]); // This effect runs when content is loaded

    useEffect(() => {
        if (isotope.current) {
            isotope.current.arrange({ filter: activeFilter });
        }
    }, [activeFilter]);

    return (
        <section id="portfolio" className="portfolio section">
            <div className="container section-title" data-aos="fade-up">
                <span className="description-title">Portfolio</span>
                <h2>Portfolio</h2>
                <p>A showcase of my recent projects. Filter by category to see more.</p>
            </div>

            <div className="container-fluid">
                <div className="isotope-layout">
                    <ul className="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
                        {categories.map(cat => (
                            <li
                                key={cat.key}
                                onClick={() => setActiveFilter(cat.key)}
                                className={activeFilter === cat.key ? 'filter-active' : ''}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>

                    <div ref={isotopeContainer} className="row g-0 isotope-container" data-aos="fade-up" data-aos-delay="200">
                        {portfolioItems.map(item => (
                            <div key={item.id} className={`col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item ${item.filterClass}`}>
                                <div className="portfolio-content h-100">
                                    <img src={item.imageUrl} className="img-fluid" alt={item.title} />
                                    <div className="portfolio-info">
                                        <a href={item.imageUrl} data-gallery="portfolio-gallery" className="glightbox preview-link">
                                            <i className="bi bi-zoom-in"></i>
                                        </a>
                                        <a href="#" title="More Details" className="details-link">
                                            <i className="bi bi-link-45deg"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-4">
                        <Link to="/gallery" className="view-more-btn">
                           View More <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;