import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(1);

  const videos = [
    "/videos/hero-video-1.mp4",
    "/videos/hero-video-2.mp4",
  ];

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.load();

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Video autoplay prevented:", error);
      }
    };

    playVideo();
  }, [currentVideo]);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev === videos.length ? 1 : prev + 1));
  };

  return (
    <section className="hero">

      {/* Background Video */}
      <div className="hero-background">

        <video
          ref={videoRef}
          key={videos[currentVideo - 1]}
          className="hero-video"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
        >
          <source
            src={videos[currentVideo - 1]}
            type="video/mp4"
          />
        </video>

      </div>

      {/* Dark overlays */}
      <div className="hero-overlay-bottom"></div>
      <div className="hero-overlay-left"></div>

      {/* Main Hero Content */}
      <div className="hero-container">

        {/* Location / Telemetry */}
        <div className="hero-telemetry">

          {/* 
          <div className="telemetry-box">
            <span className="telemetry-dot"></span>

            <span>
              32°14'48"N 77°10'33"E • HIMALAYAN PASS ELEV. 4,890M
            </span>
          </div>

          <span className="field-reference">
            // FIELD TEST REF: NM-26-09
          </span>
          */}

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

            {/* 
            <div className="hero-spec">
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
            </div>
            */}

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;