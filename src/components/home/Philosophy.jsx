import "./Philosophy.css";

function Philosophy() {
  const features = [
    {
      number: "01",
      icon: "explore",
      title: "Built to Explore",
      description:
        "Equipment designed around adventure, unpaved itineraries, and deep backcountry exploration.",
    },
    {
      number: "02",
      icon: "two_wheeler",
      title: "Journey Ready",
      description:
        "Practical modular systems designed for non-stop, high-mileage riding in varying weather regimes.",
    },
    {
      number: "03",
      icon: "verified",
      title: "Quality First",
      description:
        "Products selected and fabricated with ballistic durability, zero-fatigue fit, and lifetime reliability.",
    },
    {
      number: "04",
      icon: "landscape",
      title: "Go Further",
      description:
        "Gear created for riders, cross-continental travellers, and autonomous alpine explorers.",
    },
  ];

  return (
    <section className="philosophy" id="story">
      <div className="philosophy-container">

        {/* Section Header */}
        <div className="philosophy-marker">
          <span className="philosophy-marker-main">
            02 // THE NOMAD PHILOSOPHY
          </span>

          <span className="philosophy-line"></span>

          <span className="philosophy-marker-sub">
            EST. 2018 HIGH VALLEYS
          </span>
        </div>

        {/* Main Content */}
        <div className="philosophy-main">

          {/* Left Content */}
          <div className="philosophy-intro">
            <h2>
              BUILT FOR THE
              <br />
              UNEXPECTED
            </h2>

            <div className="philosophy-description">
              <p>
                Nomad Outdoor Expedition originated at 4,200 meters in the
                high desert passes of the Karakoram. We design for the rider
                stranded three days from the nearest asphalt, where equipment
                failure is not an inconvenience—it is a critical risk.
              </p>

              <p>
                Our minimalist aesthetic rejects ornamental clutter, ensuring
                every seam, buckle, and closure performs without compromise
                when weather, terrain, and distance test your resolve.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="philosophy-quote">
            <span className="quote-mark">99</span>

            <blockquote>
              “FROM WINDING MOUNTAIN ROADS TO REMOTE TRAILS, NOMAD OUTDOOR
              EXPEDITION BRINGS TOGETHER EQUIPMENT DESIGNED FOR PEOPLE WHO
              CHOOSE EXPLORATION OVER THE ORDINARY.”
            </blockquote>

            <div className="quote-footer">
              {/* <span>FIELD DIRECTIVE // RECORD 402</span> */}
              <span>EXPEDITION TESTED</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="philosophy-features">
          {features.map((feature) => (
            <div className="philosophy-card" key={feature.number}>
              <div className="philosophy-card-top">
                <span>{feature.number}</span>

                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Philosophy;