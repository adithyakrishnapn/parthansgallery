import React from "react";
import ContactForm from "./contactForm";

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <span className="description-title">Contact</span>
        <h2>Contact</h2>
        <p>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4" data-aos="fade-up" data-aos-delay="200">
          <div className="col-lg-6">
            <div className="info-item d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-geo-alt"></i>
              <h3>Address</h3>
              <p>Wayanad, Kerala, Sulthan Bathery</p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="info-item d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-envelope"></i>
              <h3>Email Us</h3>
              <p>parthansgallery@gmail.com</p>
            </div>
          </div>
        </div>


        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
