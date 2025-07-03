import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseconfig";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { Link } from "react-router-dom";

// Import the Gallery CSS file
import "./Gallery.css";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const isotopeContainer = useRef(null);
  const isotope = useRef(null);

  // Effect to fetch all portfolio items and randomly select 12
  useEffect(() => {
    const portfolioCollectionRef = collection(db, "portfolio");
    const q = query(portfolioCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allImages = snapshot.docs.map((doc) => {
          const data = doc.data();
          const filterClass = `filter-${data.categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
          return {
            id: doc.id,
            ...data,
            filterClass,
          };
        });

        // Randomly select 12 images
        const shuffled = allImages.sort(() => Math.random() - 0.5);
        const selectedImages = shuffled.slice(0, 12);

        setGalleryImages(selectedImages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching gallery images: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Effect to initialize Isotope and GLightbox after images are loaded
  useEffect(() => {
    if (!loading && galleryImages.length > 0 && isotopeContainer.current) {
      imagesLoaded(isotopeContainer.current, () => {
        // Destroy old instance if it exists
        if (isotope.current) {
          isotope.current.destroy();
        }

        // Re-initialize Isotope
        isotope.current = new Isotope(isotopeContainer.current, {
          itemSelector: ".portfolio-item",
          layoutMode: "masonry",
        });

        // Destroy and re-init GLightbox
        if (window.galleryLightbox) {
          window.galleryLightbox.destroy();
        }

        window.galleryLightbox = GLightbox({
          selector: ".glightbox",
          touchNavigation: true,
          loop: true,
        });
      });

      // Clean up
      return () => {
        if (isotope.current) isotope.current.destroy();
        if (window.galleryLightbox) window.galleryLightbox.destroy();
      };
    }
  }, [galleryImages, loading]);

  if (loading) {
    return (
      <section id="gallery" className="gallery section">
        <div className="container section-title" data-aos="fade-up">
          <span className="description-title">Gallery</span>
          <h2>Gallery</h2>
          <p>Loading gallery images...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery section">
      <div className="container section-title" data-aos="fade-up">
        <span className="description-title">Gallery</span>
        <h2>Gallery</h2>
        <p>A random selection of my recent work.</p>
      </div>

      <div className="container-fluid">
        <div className="isotope-layout">
          <div
            ref={isotopeContainer}
            className="row g-0 isotope-container"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className={`col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item ${image.filterClass}`}
              >
                <div className="portfolio-content h-100">
                  <img
                    src={image.imageUrl}
                    className="img-fluid"
                    alt={image.title || `Gallery image ${image.id}`}
                    loading="lazy"
                  />
                  <div className="portfolio-info">
                    <a
                      href={image.imageUrl}
                      className="glightbox preview-link"
                      data-gallery="gallery-images"
                      type="image"
                    >
                      <img
                        src={image.imageUrl}
                        alt=""
                        style={{ display: "none" }}
                      />
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

export default Gallery;
