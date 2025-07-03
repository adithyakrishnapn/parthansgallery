import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';

const About = () => {
    // --- State to hold dynamic content ---
    const [profileImage, setProfileImage] = useState(null);
    const [aboutInfo, setAboutInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Effect to fetch data from Firestore ---
    useEffect(() => {
        // Listener for the profile image
        const unsubProfileImage = onSnapshot(doc(db, "siteContent", "profileImage"), (doc) => {
            if (doc.exists()) {
                setProfileImage(doc.data());
            } else {
                setProfileImage(null); // Handle case where image is deleted
            }
        });

        // Listener for the about me text content
        const unsubAboutInfo = onSnapshot(doc(db, "siteContent", "aboutInfo"), (doc) => {
            if (doc.exists()) {
                setAboutInfo(doc.data());
            }
            setLoading(false); // We can show the page even if text content isn't set
        });

        // Cleanup listeners on unmount
        return () => {
            unsubProfileImage();
            unsubAboutInfo();
        };
    }, []); // Runs once on mount

    if (loading) {
        return <section id="about" className="about section"><div className="container"><p>Loading...</p></div></section>;
    }

    // Default content in case it's not set in Firestore yet
    const content = aboutInfo || {
        title: "Photography, Video, and Design",
        italicIntro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        birthday: "14 May 2003",
        website: "www.parthansgallery.studio",
        // phone: "+123 456 7890",
        city: "Kerala, INDIA",
        // age: "30",
        degree: "Bachelors",
        email: "parthansgallery@gmail.com",
        freelance: "Available",
        mainParagraph: "I'm a passionate and growing photographer and videographer with a sharp eye for detail and a deep love for visual storytelling. Whether it's capturing the raw emotion of a candid moment or crafting the perfect frame in motion, I bring creativity, dedication, and originality to every project. From portraits and events to cinematic edits, I aim to create work that reflects not just what is seen—but what is truly felt."
    };

    return (
        <section id="about" className="about section">
            <div className="container section-title" data-aos="fade-up">
                <span className="description-title">About me</span>
                <h2>About Me</h2>
                <p>Capturing moments, telling stories.</p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4 justify-content-center">
                    <div className="col-lg-4">
                        {profileImage ? (
                            <img src={profileImage.imageUrl} className="img-fluid" alt="A professional headshot of the site owner" />
                        ) : (
                            <div className="img-placeholder"></div> // Placeholder for when no image is uploaded
                        )}
                    </div>
                    <div className="col-lg-8 content">
                        <h2>{content.title}</h2>
                        <p className="fst-italic py-3">{content.italicIntro}</p>
                        <div className="row">
                            <div className="col-lg-6">
                                <ul>
                                    <li><i className="bi bi-chevron-right"></i> <strong>Birthday:</strong> <span>{content.birthday}</span></li>
                                    <li><i className="bi bi-chevron-right"></i> <strong>Website:</strong> <span>{content.website}</span></li>
                                    {/* <li><i className="bi bi-chevron-right"></i> <strong>Phone:</strong> <span>{content.phone}</span></li> */}
                                    <li><i className="bi bi-chevron-right"></i> <strong>City:</strong> <span>{content.city}</span></li>
                                </ul>
                            </div>
                            <div className="col-lg-6">
                                <ul>
                                    {/* <li><i className="bi bi-chevron-right"></i> <strong>Age:</strong> <span>{content.age}</span></li> */}
                                    <li><i className="bi bi-chevron-right"></i> <strong>Degree:</strong> <span>{content.degree}</span></li>
                                    <li><i className="bi bi-chevron-right"></i> <strong>Email:</strong> <span>{content.email}</span></li>
                                    <li><i className="bi bi-chevron-right"></i> <strong>Freelance:</strong> <span>{content.freelance}</span></li>
                                </ul>
                            </div>
                        </div>
                        <p className="py-3">{content.mainParagraph}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;