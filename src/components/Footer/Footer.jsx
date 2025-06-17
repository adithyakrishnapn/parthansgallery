import React from "react";

const Footer = () => {
  return (
    <footer id="footer" class="footer position-relative dark-background">
      <div class="container">
        <h3 class="sitename">
          Laura Thomson
          <br />
        </h3>
        <p>
          Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni
          eligendi fuga maxime saepe commodi placeat.
        </p>
        <div class="social-links d-flex justify-content-center">
          <a href="">
            <i class="bi bi-twitter-x"></i>
          </a>
          <a href="">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="">
            <i class="bi bi-skype"></i>
          </a>
          <a href="">
            <i class="bi bi-linkedin"></i>
          </a>
        </div>
        <div class="container">
          <div class="copyright">
            <span>Copyright</span> <strong class="px-1 sitename">Laura</strong>{" "}
            <span>All Rights Reserved</span>
          </div>
          <div class="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
