import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';

//fallback image
import staticHeroImage from '../../assets/img/hero-bg.jpg';

const Landing = () => {

    const [dynamicImageUrl, setDynamicImageUrl] = useState(null);

    useEffect(() => {
        const docRef = doc(db, "siteContent", "landerImage");

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists() && doc.data().imageUrl) {
                setDynamicImageUrl(doc.data().imageUrl);
            } else {
                // If no document or no URL, we'll rely on the fallback
                setDynamicImageUrl(''); // Set to empty string to indicate fetch is complete
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []); 
    const imageUrl = dynamicImageUrl;

    return (
        <section id="hero" className="hero section dark-background">
            
            <img src={imageUrl} alt="Hero background" data-aos="fade-in" />

            <div className="container text-center" data-aos="fade-up" data-aos-delay="100">
                <h2>Parthan C</h2>
                <p>I'M A PROFESSIONAL PHOTOGRAPHER IN KERALA</p>
                <a href="#about" className="btn-scroll" title="Scroll Down">
                    <i className="bi bi-chevron-down"></i>
                </a>
            </div>

        </section>
    );
}

export default Landing;