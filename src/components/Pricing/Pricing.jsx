import React from "react";

const Pricing = () => {
  return (
    <>
    <section id="pricing" className="pricing section">
      <div className="container section-title" data-aos="fade-up">
        <span className="description-title">Pricing</span>
        <h2>Pricing</h2>
        <p>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="pricing-item">
              <h3>Free</h3>
              <h4>
                <sup>$</sup>0<span> / month</span>
              </h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li className="na">Pharetra massa</li>
                <li className="na">Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">
                  Buy Now
                </a>
              </div>
            </div>
          </div>

          <div
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="pricing-item recommended">
              <span className="recommended-badge">Recommended</span>
              <h3>Business</h3>
              <h4>
                <sup>$</sup>19<span> / month</span>
              </h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li>Pharetra massa</li>
                <li className="na">Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">
                  Buy Now
                </a>
              </div>
            </div>
          </div>

          <div
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="pricing-item">
              <h3>Developer</h3>
              <h4>
                <sup>$</sup>29<span> / month</span>
              </h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li>Pharetra massa</li>
                <li>Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="pricing-2" className="pricing-2 section">

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="row gy-4 gx-lg-5">

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Portrait Photography</h3>
              <h4>$160.00</h4>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Fashion Photography</h3>
              <h4>$300.00</h4>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Sports Photography</h3>
              <h4>$200.00</h4>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Still Life Photography</h3>
              <h4>$120.00</h4>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Wedding Photography</h3>
              <h4>$500.00</h4>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pricing-item d-flex justify-content-between">
              <h3>Photojournalism</h3>
              <h4>$200.00</h4>
            </div>
          </div>

        </div>

      </div>

    </section>
    </>
  );
};

export default Pricing;
