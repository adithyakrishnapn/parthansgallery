import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebaseconfig";

// --- 1. Import GLightbox here ---
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css'; 
import { Link } from "react-router-dom";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Effect to fetch data (this part is correct and stays the same) ---
  useEffect(() => {
    const portfolioCollectionRef = collection(db, "portfolio");
    const q = query(
      portfolioCollectionRef,
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryImages(fetchedImages);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery images: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // useEffect to initialize GLightbox AFTER images are loaded ---
  useEffect(() => {
    // We don't want to initialize GLightbox if there are no images or we are still loading.
    if (loading || galleryImages.length === 0) {
      return;
    }

    const lightbox = GLightbox({
      selector: ".glightbox", // It will now find the newly rendered links
    });

    return () => {
      lightbox.destroy();
    };
  }, [loading, galleryImages]); // Dependency array: re-run this effect when loading state or images change.

  if (loading) {
    return (
      <section id="gallery" className="gallery section">
        <div className="container text-center"><p>Loading Gallery...</p></div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery section">
      <div className="container section-title" data-aos="fade-up">
        <span className="description-title">Gallery</span>
        <h2>Gallery</h2>
        <p>A selection of my recent work.</p>
      </div>

      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-0">
          {galleryImages.map((image) => (
            <div key={image.id} className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href={image.imageUrl}
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title || `Gallery image ${image.id}`}
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-4">
        <Link to="/gallery" className="view-more-btn">
          View More <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </section>
  );
};

export default Gallery;