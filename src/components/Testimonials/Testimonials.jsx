import React from 'react';

// --- 1. Import Swiper React components & modules ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// --- 2. Import Swiper styles ---
// These are the new, correct paths for Swiper's CSS
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/pagination';

// --- 3. Import your images ---
// Move these images into your src/assets/img folder
import testimonialsBg from '../../assets/img/testimonials-bg.jpg';
import testimonialImg1 from '../../assets/img/testimonials/testimonials-1.jpg';
import testimonialImg2 from '../../assets/img/testimonials/testimonials-2.jpg';
import testimonialImg3 from '../../assets/img/testimonials/testimonials-3.jpg';
import testimonialImg4 from '../../assets/img/testimonials/testimonials-4.jpg';
import testimonialImg5 from '../../assets/img/testimonials/testimonials-5.jpg';

// --- 4. Create a data array for your testimonials ---
const testimonialsData = [
    {
        img: testimonialImg1,
        name: 'Saul Goodman',
        title: 'Ceo & Founder',
        quote: 'Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.'
    },
    {
        img: testimonialImg2,
        name: 'Sara Wilsson',
        title: 'Designer',
        quote: 'Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.'
    },
    {
        img: testimonialImg3,
        name: 'Jena Karlis',
        title: 'Store Owner',
        quote: 'Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.'
    },
    {
        img: testimonialImg4,
        name: 'Matt Brandon',
        title: 'Freelancer',
        quote: 'Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.'
    },
    {
        img: testimonialImg5,
        name: 'John Larson',
        title: 'Entrepreneur',
        quote: 'Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.'
    }
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="testimonials section dark-background">

            <img src={testimonialsBg} className="testimonials-bg" alt="Abstract background for testimonials section" />

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                {/* The Swiper component replaces the old div and script tag */}
                <Swiper
                    // Install Swiper modules
                    modules={[Autoplay, Pagination]}
                    // Pass the configuration as props
                    loop={true}
                    speed={600}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    slidesPerView={'auto'}
                    pagination={{
                        el: '.swiper-pagination',
                        type: 'bullets',
                        clickable: true,
                    }}
                >
                    {/* The swiper-wrapper div is created automatically */}
                    
                    {/* Map over your data to create a slide for each testimonial */}
                    {testimonialsData.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className="testimonial-item">
                                <img src={testimonial.img} className="testimonial-img" alt={`Testimonial from ${testimonial.name}`} />
                                <h3>{testimonial.name}</h3>
                                <h4>{testimonial.title}</h4>
                                <div className="stars">
                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                </div>
                                <p>
                                    <i className="bi bi-quote quote-icon-left"></i>
                                    <span>{testimonial.quote}</span>
                                    <i className="bi bi-quote quote-icon-right"></i>
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* The pagination element needs to be a direct child of Swiper */}
                    <div className="swiper-pagination"></div>
                </Swiper>
            </div>
        </section>
    );
}

export default Testimonials;