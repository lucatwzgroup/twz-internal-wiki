import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">K</div>
            <h2>Company Knowledge Base</h2>
          </div>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="#">Request Document</a>
            <a href="#">Contact IT Support</a>
            <a href="#">Feedback</a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
