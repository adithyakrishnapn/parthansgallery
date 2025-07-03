import React from 'react';

const Service = () => {
    return (
        <section id="services" className="services section">
            <div className="container section-title" data-aos="fade-up">
                <span className="description-title">My Services</span>
                <h2>My Services</h2>
                <p>Offering a range of creative solutions to capture, create, and showcase moments through the lens and beyond.</p>
            </div>

            <div className="container">
                <div className="row gy-4">

                    <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
                        <div className="service-item position-relative">
                            <div className="icon"><i className="bi bi-camera icon"></i></div>
                            <h4>Photography</h4>
                            <p>Professional photography services for events, portraits, products, and more with a unique creative touch.</p>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="200">
                        <div className="service-item position-relative">
                            <div className="icon"><i className="bi bi-camera-reels icon"></i></div>
                            <h4>Videography</h4>
                            <p>Cinematic videography to tell powerful stories—ideal for weddings, promotions, travel, and content creators.</p>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="300">
                        <div className="service-item position-relative">
                            <div className="icon"><i className="bi bi-scissors icon"></i></div>
                            <h4>Video Editing</h4>
                            <p>Smooth, engaging edits with transitions, color grading, and music—perfect for YouTube, reels, and short films.</p>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="400">
                        <div className="service-item position-relative">
                            <div className="icon"><i className="bi bi-palette icon"></i></div>
                            <h4>Poster & Design</h4>
                            <p>Creative poster design and social media graphics tailored to personal brands, events, and promotions.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Service;
