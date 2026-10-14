import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

const shopCategories = [
  { label: "HELMETS", category: "Helmets" },
  { label: "RIDING GEAR", category: "Riding Gear" },
  { label: "LUGGAGE", category: "Camping" },
  { label: "CAMPING", category: "Camping" },
];

const Footer = () => {

const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  if (location.pathname === "/" && location.hash === "#basecamp-dispatch") {
    const frame = requestAnimationFrame(() => {
      document
        .getElementById("basecamp-dispatch")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => cancelAnimationFrame(frame);
  }
}, [location.pathname, location.hash]);

const handleTrekkingClick = (event) => {
  event.preventDefault();

  if (location.pathname === "/") {
    document
      .getElementById("basecamp-dispatch")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (location.hash !== "#basecamp-dispatch") {
      navigate("/#basecamp-dispatch", { replace: true });
    }
  } else {
    navigate("/#basecamp-dispatch");
  }
};

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" aria-label="Nomad home">
            <img
              src="/images/logo/logo.png"
              alt="Nomad Outdoor Expedition"
              className="footer-logo"
            />
          </Link>

          <p className="footer-tagline">
            Gear for riders, travellers and explorers.
            Built for the road beyond.
          </p>

          <div className="footer-telemetry">
            <span className="telemetry-label">
              COORDINATES // TELEMETRY
            </span>
            <span className="telemetry-value">
              ALPINE BASECAMP 4,200M
            </span>
          </div>
        </div>

        <nav className="footer-links-grid" aria-label="Footer navigation">
          <div className="footer-column">
            <h4>EXPLORE</h4>
            <ul>
              <li><Link to="/">HOME</Link></li>
              <li><Link to="/products">PRODUCTS</Link></li>
              <li><Link to="/story">OUR STORY</Link></li>
              <li><Link to="/expeditions">EXPEDITIONS</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>SHOP</h4>
            <ul>
              {shopCategories.map(({ label, category }) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
  <Link
    to="/#basecamp-dispatch"
    onClick={handleTrekkingClick}
  >
    TREKKING
  </Link>
</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>SUPPORT</h4>
            <ul>
              <li><Link to="/shipping">SHIPPING</Link></li>
              <li><Link to="/returns">RETURNS</Link></li>
              <li><Link to="/warranty">WARRANTY</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">CONTACT US</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>CONNECT</h4>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/kultxi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  YOUTUBE
                </a>
              </li>
              <li>
                <Link to="/#newsletter">DISPATCH NEWSLETTER</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} NOMAD OUTDOOR EXPEDITION.
          ALL RIGHTS RESERVED.
        </p>

        <div className="legal-links">
          <Link to="/privacy-policy">PRIVACY POLICY</Link>
          <Link to="/terms">TERMS OF DISPATCH</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
