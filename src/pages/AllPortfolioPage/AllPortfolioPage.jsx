import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { Link } from 'react-router-dom';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import GLightbox from 'glightbox';

// --- Swiper Components & Modules ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// --- All Necessary CSS Imports ---
import './AllPortfolioPage.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'glightbox/dist/css/glightbox.min.css';

const AllPortfolioPage = () => {
    // --- State Management ---
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sliderImages, setSliderImages] = useState([]);
    const [activeFilter, setActiveFilter] = useState('*');
    const [loading, setLoading] = useState(true);

    // Ref for the Isotope grid container
    const isotopeContainer = useRef(null);
    const isotope = useRef(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        // 1. Fetch Categories for filter buttons
        const categoriesQuery = query(collection(db, "categories"), orderBy("name"));
        const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
            const fetchedCategories = snapshot.docs.map(doc => {
                const name = doc.data().name;
                const key = `.filter-${name.toLowerCase().replace(/\s+/g, '-')}`;
                return { name, key };
            });
            setCategories([{ name: 'All', key: '*' }, ...fetchedCategories]);
        });

        // 2. Fetch Featured Images for the top slider
        const featuredQuery = query(collection(db, "featuredImages"), orderBy("createdAt", "asc"));
        const unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
            setSliderImages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        // 3. Fetch ALL Portfolio Items for the main grid
        const portfolioQuery = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const unsubPortfolio = onSnapshot(portfolioQuery, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => {
                const data = doc.data();
                const filterClass = `filter-${data.categoryName.toLowerCase().replace(/\s+/g, '-')}`;
                return { id: doc.id, ...data, filterClass };
            });
            setPortfolioItems(fetchedItems);
            setLoading(false); // We are done loading after the main content is fetched
        });

        // This command instantly scrolls the window to the top (x: 0, y: 0)
        window.scrollTo(0, 0);
        // Cleanup all listeners on component unmount
        return () => {
            unsubCategories();
            unsubFeatured();
            unsubPortfolio();
        };
    }, []);

    // --- Library Initialization Effect (Isotope & GLightbox) ---
    useEffect(() => {
        if (!loading && portfolioItems.length > 0 && isotopeContainer.current) {
            imagesLoaded(isotopeContainer.current, () => {
                if (isotope.current) isotope.current.destroy();
                isotope.current = new Isotope(isotopeContainer.current, {
                    itemSelector: '.portfolio-item',
                    layoutMode: 'masonry',
                });
            });

            const lightbox = GLightbox({ selector: '.portfolio-item .glightbox' });
            return () => {
                if (isotope.current) isotope.current.destroy();
                lightbox.destroy();
            };
        }
    }, [loading, portfolioItems]);

    // --- Filtering Effect ---
    useEffect(() => {
        if (isotope.current) {
            isotope.current.arrange({ filter: activeFilter });
        }
    }, [activeFilter]);

    return (
        <main className="all-portfolio-page">
            
            {/* --- TOP IMAGE SLIDER --- */}
            {!loading && sliderImages.length > 0 && (
                <div className="portfolio-slider-container" data-aos="fade-in">
                    <Swiper
                        modules={[Autoplay, EffectFade, Navigation, Pagination]}
                        effect="fade"
                        speed={1500}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        pagination={{ clickable: true }}
                        navigation={true}
                        className="portfolio-hero-swiper"
                    >
                        {sliderImages.map(item => (
                            <SwiperSlide key={item.id} style={{ backgroundImage: `url(${item.imageUrl})` }}>
                                <div className="slide-content">
                                    <h2>GALLERY</h2>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* --- MAIN PORTFOLIO GRID --- */}
            <section id="full-portfolio" className="portfolio section">
                <div className="container section-title" data-aos="fade-up">
                    <span className="description-title">Our Work</span>
                    <h2>Full Portfolio</h2>
                    <p>Browse our complete collection of projects. Use the filters to find what you're looking for.</p>
                </div>

                <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading Projects...</p>
                        </div>
                    ) : (
                        <div className="isotope-layout">
                            <ul className="portfolio-filters isotope-filters">
                                {categories.map(cat => (
                                    <li key={cat.key} onClick={() => setActiveFilter(cat.key)} className={activeFilter === cat.key ? 'filter-active' : ''}>
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>

                            <div ref={isotopeContainer} className="row g-0 isotope-container">
                                {portfolioItems.map(item => (
                                    <div key={item.id} className={`col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item ${item.filterClass}`}>
                                        <div className="portfolio-content h-100">
                                            <img src={item.imageUrl} className="img-fluid" alt={item.title} />
                                            <div className="portfolio-info">
                                                <a href={item.imageUrl} data-gallery="full-portfolio-gallery" className="glightbox preview-link">
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
                        </div>
                    )}
                </div>

                <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="200">
                    <Link to="/" className="back-to-home-btn">
                        <i className="bi bi-arrow-left-circle"></i> Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default AllPortfolioPage;