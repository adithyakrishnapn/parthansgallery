import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// --- Global CSS Imports ---
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "swiper/css/bundle";
import "./App.css";

// --- Library & Component Imports ---
import AOS from "aos";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollTop from "./components/ScrollTop/ScrollTop";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

// --- Page Imports ---
import Home from "./pages/Home/Home";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AllPortfolioPage from "./pages/AllPortfolioPage/AllPortfolioPage";

function App() {
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  // This useEffect handles truly global effects only
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    const handleScroll = () => {
      // The header now manages its own 'scrolled' class, but we can keep this for other potential global effects.
      // document.body.classList.toggle("scrolled", window.scrollY > 100);

      // This state is for the ScrollTop button
      setIsScrollTopVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Header and Footer are outside Routes to appear on every page */}
      <Header />
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<AllPortfolioPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Optional: A catch-all 404 route */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>

      <Footer />
      <ScrollTop isVisible={isScrollTopVisible} />
    </>
  );
}

export default App;