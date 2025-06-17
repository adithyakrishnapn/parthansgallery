import React from "react";
import Landing from "../../components/Landing/Landing";
import About from "../../components/About/About";
import Resume from "../../components/Resume/Resume";
import Service from "../../components/Service/Service";
import Testimonials from "../../components/Testimonials/Testimonials";
import Portfolio from "../../components/Portfolio/Portfolio";
import Pricing from "../../components/Pricing/Pricing";
import Gallery from "../../components/Gallery/Gallery";
import Contact from "../../components/Contact/Contact";

const Home = () => {
  return (

      <div className="main">
        <Landing />
        <About />
        <Resume />
        <Gallery />
        <Service />
        <Testimonials />
        <Portfolio />
        <Pricing />
        <Contact />
      </div>
  );
};

export default Home;
