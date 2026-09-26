import { Link } from "react-router-dom";
import React from "react";
import "./JourneyBanner.css";


const JourneyBanner = () => {
  return (
    <section className="journey-banner">
      <div className="journey-overlay"></div>
      <div className="journey-content">
        <span className="journey-tag">TRANS-CONTINENTAL RIGIDITY</span>
        <h2 className="journey-heading">
          THE JOURNEY IS<br />THE DESTINATION
        </h2>
        <p className="journey-description">
          Gear up. Ride further. Explore beyond the map with confidence forged in high altitudes.
        </p>
        <Link to="/story" className="hero-button">
          EXPLORE NOMAD
        </Link>
      </div>
    </section>
  );
};

export default JourneyBanner;