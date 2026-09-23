import React from "react";
import { Link } from "react-router-dom";

import "./Story.css";

function Story() {
  return (
    <main className="story-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="story-hero">

        <div className="story-hero-image">
          <img
            src="/images/story/story-hero.jpg"
            alt="Nomad expedition through the mountains"
          />
        </div>

        <div className="story-hero-overlay" />

        <div className="story-hero-content">

          <span className="story-eyebrow">
            THE NOMAD STORY
          </span>

          <h1>
            BUILT FOR
            <br />
            THE JOURNEY
          </h1>

          <p>
            We create equipment for people who
            choose the long way around.
          </p>

          <div className="story-hero-line" />

        </div>

        <div className="story-hero-index">
          <span>01</span>
          <span>OUR ORIGIN</span>
        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="story-intro">

        <div className="story-container">

          <div className="story-intro-label">
            <span>02</span>
            <span>THE BEGINNING</span>
          </div>

          <div className="story-intro-content">

            <h2>
              NOT MADE FOR
              <br />
              THE EASY WAY.
            </h2>

            <div className="story-intro-text">

              <p className="story-lead">
                NOMAD was born from a simple idea:
                the gear you carry should never
                stand between you and the journey.
              </p>

              <p>
                From remote trails to unfamiliar
                streets, we believe the best
                experiences happen when you leave
                the predictable path behind.
              </p>

              <p>
                Every piece is designed around that
                mindset — practical, durable and
                stripped back to what actually
                matters.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          IMAGE BREAK
      ===================================================== */}

      <section className="story-image-break">

        <div className="story-image-break-image">

          <img
            src="/images/story/Mountain.png"
            alt="Mountain landscape"
          />

        </div>

        <div className="story-image-break-content">

          <span>
            GO FURTHER
          </span>

          <strong>
            THE ROAD
            <br />
            IS PART OF
            <br />
            THE STORY.
          </strong>

        </div>

      </section>


      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="story-philosophy">

        <div className="story-container">

          <div className="story-section-heading">

            <div className="story-section-number">
              03
            </div>

            <div>
              <span className="story-eyebrow">
                OUR PHILOSOPHY
              </span>

              <h2>
                LESS GEAR.
                <br />
                MORE JOURNEY.
              </h2>
            </div>

          </div>


          <div className="story-principles">

            {/* PRINCIPLE 01 */}

            <article className="story-principle">

              <span className="story-principle-number">
                01
              </span>

              <span className="material-symbols-outlined">
                explore
              </span>

              <h3>
                PURPOSE
              </h3>

              <p>
                Every detail has a reason.
                We remove the unnecessary and
                keep the things that earn their
                place in your pack.
              </p>

            </article>


            {/* PRINCIPLE 02 */}

            <article className="story-principle">

              <span className="story-principle-number">
                02
              </span>

              <span className="material-symbols-outlined">
                landscape
              </span>

              <h3>
                DURABILITY
              </h3>

              <p>
                Your equipment should become
                part of the journey, not another
                thing you have to worry about.
              </p>

            </article>


            {/* PRINCIPLE 03 */}

            <article className="story-principle">

              <span className="story-principle-number">
                03
              </span>

              <span className="material-symbols-outlined">
                route
              </span>

              <h3>
                FREEDOM
              </h3>

              <p>
                Good gear gives you confidence
                to take the next turn, follow the
                unfamiliar trail and keep moving.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          DETAIL IMAGE
      ===================================================== */}

      <section className="story-detail">

        <div className="story-detail-image">

          <img
            src="/images/story/Bike-rider.png"
            alt="Nomad outdoor equipment"
          />

        </div>

        <div className="story-detail-content">

          <span className="story-eyebrow">
            MADE TO MOVE
          </span>

          <h2>
            YOUR GEAR
            <br />
            SHOULD KEEP UP.
          </h2>

          <p>
            Whether you're heading into the
            mountains, crossing a new city or
            simply taking the longer route home,
            NOMAD is made to move with you.
          </p>

        </div>

      </section>


      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="story-closing">

        <div className="story-closing-content">

          <span className="story-eyebrow">
            YOUR NEXT EXPEDITION
          </span>

          <h2>
            THE JOURNEY
            <br />
            STARTS HERE.
          </h2>

          <p>
            Pack light. Go further.
          </p>

          <Link
            to="/products"
            className="story-cta"
          >
            EXPLORE THE EQUIPMENT

            <span className="material-symbols-outlined">
              arrow_forward
            </span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Story;