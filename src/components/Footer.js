import React from 'react';
import logoImage from '../data/logo.png'; // Adjust the path to your logo file


function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
 <div className="logo-icon">
  <img src={logoImage} alt="Logo" className="logo-image" />
</div>            <h2>TWZ Wiki</h2>
          </div>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="#">Handleiding Aanvragen</a>
            <a href="#">Contacteer IT Support</a>
            <a href="#">Feedback</a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} T.W.Z. NV. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
