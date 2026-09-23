import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <img src="/images/logo/logo.png" alt="Nomad Logo" className="footer-logo" />
          <p className="footer-tagline">
            Gear for riders, travellers and explorers. Built for the road beyond.
          </p>
          <div className="footer-telemetry">
            <span className="telemetry-label">COORDINATES // TELEMETRY</span>
            <span className="telemetry-value">ALPINE BASECAMP 4,200M</span>
          </div>
        </div>

        {/* Links Columns */}
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>EXPLORE</h4>
            <ul>
              <li><a href="#home">HOME</a></li>
              <li><a href="#products">PRODUCTS</a></li>
              <li><a href="#story">OUR STORY</a></li>
              <li><a href="#expeditions">EXPEDITIONS</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>SHOP</h4>
            <ul>
              <li><a href="#helmets">HELMETS</a></li>
              <li><a href="#riding-gear">RIDING GEAR</a></li>
              <li><a href="#luggage">LUGGAGE</a></li>
              <li><a href="#camping">CAMPING</a></li>
              <li><a href="#trekking">TREKKING</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>SUPPORT</h4>
            <ul>
              <li><a href="#shipping">SHIPPING</a></li>
              <li><a href="#returns">RETURNS</a></li>
              <li><a href="#warranty">WARRANTY</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">CONTACT US</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>CONNECT</h4>
            <ul>
              <li><a href="#instagram">INSTAGRAM</a></li>
              <li><a href="#youtube">YOUTUBE</a></li>
              <li><a href="#newsletter">DISPATCH NEWSLETTER</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="footer-bottom">
        <p className="copyright">
          © 2026 NOMAD OUTDOOR EXPEDITION. ALL RIGHTS RESERVED.
        </p>
        <div className="legal-links">
          <a href="#privacy">PRIVACY POLICY</a>
          <a href="#terms">TERMS OF DISPATCH</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;