import React, { useState, useEffect, useRef } from 'react';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { Link } from 'react-router-dom';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

import './Portfolio.css'; 

const Portfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [allPortfolioItems, setAllPortfolioItems] = useState([]); // Store all items
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState('*');
    const [loading, setLoading] = useState(true);

    const isotopeContainer = useRef(null);
    const isotope = useRef(null);

    // --- Data Fetching Effect (Similar to AllPortfolioPage) ---
    useEffect(() => {
        // 1. Fetch Categories for filter buttons
        const categoriesQuery = query(collection(db, "categories"), orderBy("name"));
        const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
            const fetchedCategories = snapshot.docs.map(doc => {
                const name = doc.data().name;
                return { name, key: name };
            });
            setCategories([{ name: 'All', key: '*' }, ...fetchedCategories]);
        });

        // 2. Fetch ALL Portfolio Items (like AllPortfolioPage)
        const portfolioQuery = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const unsubPortfolio = onSnapshot(portfolioQuery, (snapshot) => {
            const allItems = snapshot.docs.map(doc => {
                const data = doc.data();
                const filterClass = `filter-${data.categoryName.toLowerCase().replace(/\s+/g, '-')}`;
                return { id: doc.id, ...data, filterClass };
            });
            
            setAllPortfolioItems(allItems);
            
            // Generate initial selection based on current filter
            const selectedItems = getFilteredItems(allItems, activeFilter);
            setPortfolioItems(selectedItems);
            setLoading(false);
        });

        // Cleanup listeners on component unmount
        return () => {
            unsubCategories();
            unsubPortfolio();
        };
    }, []);

    // Function to get items based on current filter
    const getFilteredItems = (allItems, filter) => {
        if (allItems.length === 0) return [];
        
        if (filter === '*') {
            // For "All" filter, show balanced selection of 12 items
            return getBalancedSelection(allItems);
        } else {
            // For specific categories, show up to 12 items from that category
            const categoryItems = allItems.filter(item => item.categoryName === filter);
            return categoryItems.slice(0, 12);
        }
    };

    // Function to get balanced selection of items (max 12, distributed across categories)
    const getBalancedSelection = (allItems) => {
        const maxTotal = 12;
        const maxPerCategory = 3;
        
        // Group items by category
        const itemsByCategory = {};
        allItems.forEach(item => {
            if (!itemsByCategory[item.categoryName]) {
                itemsByCategory[item.categoryName] = [];
            }
            itemsByCategory[item.categoryName].push(item);
        });
        
        const selectedItems = [];
        const categories = Object.keys(itemsByCategory);
        
        // First pass: Take 1 item from each category
        categories.forEach(category => {
            if (selectedItems.length < maxTotal && itemsByCategory[category].length > 0) {
                selectedItems.push(itemsByCategory[category].shift());
            }
        });
        
        // Second pass: Fill remaining slots, respecting maxPerCategory limit
        let categoryIndex = 0;
        while (selectedItems.length < maxTotal) {
            let addedItem = false;
            
            for (let i = 0; i < categories.length && selectedItems.length < maxTotal; i++) {
                const category = categories[categoryIndex % categories.length];
                const categoryItems = itemsByCategory[category];
                
                // Count current items from this category
                const currentCount = selectedItems.filter(item => item.categoryName === category).length;
                
                if (categoryItems.length > 0 && currentCount < maxPerCategory) {
                    selectedItems.push(categoryItems.shift());
                    addedItem = true;
                }
                categoryIndex++;
            }
            
            // Break if no items were added (avoid infinite loop)
            if (!addedItem) break;
        }
        
        // Shuffle for random display
        return selectedItems.sort(() => Math.random() - 0.5);
    };

    // --- Library Initialization Effect (Similar to AllPortfolioPage) ---
    useEffect(() => {
        if (!loading && portfolioItems.length > 0 && isotopeContainer.current) {
            imagesLoaded(isotopeContainer.current, () => {
                if (isotope.current) isotope.current.destroy();
                isotope.current = new Isotope(isotopeContainer.current, {
                    itemSelector: '.portfolio-item',
                    layoutMode: 'masonry',
                });
            });

            const lightbox = GLightbox({ 
                selector: '.portfolio-item .glightbox',
                data: 'gallery="portfolio-gallery"'
            });
            return () => {
                if (isotope.current) isotope.current.destroy();
                lightbox.destroy();
            };
        }
    }, [loading, portfolioItems]);

    // --- Filtering Effect ---
    useEffect(() => {
        if (allPortfolioItems.length > 0) {
            // Update portfolio items based on filter
            const filteredItems = getFilteredItems(allPortfolioItems, activeFilter);
            setPortfolioItems(filteredItems);
        }
    }, [activeFilter, allPortfolioItems]);

    // --- Isotope Layout Effect ---
    useEffect(() => {
        if (isotope.current) {
            // Since we're changing the actual items, we need to reload isotope
            setTimeout(() => {
                if (isotope.current) {
                    isotope.current.reloadItems();
                    isotope.current.layout();
                }
            }, 100);
        }
    }, [portfolioItems]);

    const handleFilterClick = (filterKey) => {
        setActiveFilter(filterKey);
    };

    if (loading) {
        return (
            <section id="portfolio" className="portfolio section">
                <div className="container section-title" data-aos="fade-up">
                    <span className="description-title">Portfolio</span>
                    <h2>Portfolio</h2>
                    <p>Loading portfolio items...</p>
                </div>
            </section>
        );
    }

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
                                onClick={() => handleFilterClick(cat.key)}
                                className={activeFilter === cat.key ? 'filter-active' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>

                    <div ref={isotopeContainer} className="row g-0 isotope-container" data-aos="fade-up" data-aos-delay="200">
                        {portfolioItems.map(item => (
                            <div 
                                key={item.id} 
                                className={`col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item ${item.filterClass}`}
                            >
                                <div className="portfolio-content h-100">
                                    <img 
                                        src={item.imageUrl} 
                                        className="img-fluid" 
                                        alt={item.title || `Portfolio image ${item.id}`}
                                        loading="lazy"
                                    />
                                    <div className="portfolio-info">
                                        <a 
                                            href={item.imageUrl} 
                                            data-gallery="portfolio-gallery" 
                                            className="glightbox preview-link"
                                        >
                                            <i className="bi bi-zoom-in"></i>
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