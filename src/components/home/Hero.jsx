import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      {/* Background Image */}
      <div className="hero-background"></div>

      {/* Dark overlays */}
      <div className="hero-overlay-bottom"></div>
      <div className="hero-overlay-left"></div>

      {/* Main Hero Content */}
      <div className="hero-container">

        {/* Location / Telemetry */}
        <div className="hero-telemetry">

          {/* <div className="telemetry-box">
            <span className="telemetry-dot"></span>

            <span>
              32°14'48"N 77°10'33"E • HIMALAYAN PASS ELEV. 4,890M
            </span>
          </div>

          <span className="field-reference">
            // FIELD TEST REF: NM-26-09
          </span>*/}

        </div> 

        {/* Main Content */}
        <div className="hero-main">

          <div className="hero-title-area">

            <p className="hero-label">
              Nomad Outdoor Expedition
            </p>

            <h1>
              Built for
              <br />
              The Road Beyond
            </h1>

          </div>

          <p className="hero-description">
            Adventure gear engineered for riders, travellers and
            explorers who choose the longer way.
          </p>

          <div className="hero-actions">
            <Link to="/story" className="hero-button">
                Our Story
              </Link>
          </div>

        </div>

        {/* Bottom Information */}
        <div className="hero-footer">

          <div className="hero-specifications">

            {/* <div className="hero-spec">
              <span className="spec-label">
                Durability Grade
              </span>

              <span className="spec-value">
                MIL-SPEC 1000D / CE LVL 2
              </span>
            </div>

            <div className="spec-divider"></div>

            <div className="hero-spec">
              <span className="spec-label">
                Terrain Ready
              </span>

              <span className="spec-value">
                All-Altitude Alpine
              </span>
            </div> */}

          </div>

          {/* <div className="scroll-indicator">
            <span>
              {/* Scroll to Traverse */}
            {/* </span>

            <span className="material-symbols-outlined">
              arrow_downward
            </span>
          </div> */} 

        </div>

      </div>

    </section>
  );
}

export default Hero;