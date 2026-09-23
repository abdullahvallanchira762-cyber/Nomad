import React, { useState } from "react";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    riderName: "",
    email: "",
    topic: "Technical Gear Sizing & Armor Guidance",
    details: "",
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left Column: Info Cards */}
        <div className="contact-info">
          <span className="contact-subtag">04 // BASECAMP DISPATCH</span>
          <h2 className="contact-title">LET’S PLAN YOUR NEXT EXPEDITION</h2>
          <p className="contact-description">
            Have a question about our equipment, fitment specs, or extreme endurance routes? Get in direct contact with our expedition gear coordinators.
          </p>

          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <div>
                <span className="info-label">FIELD HQ</span>
                <p className="info-value">Leh Ladakh Expedition Hub, Sector 4</p>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">📡</span>
              <div>
                <span className="info-label">ENCRYPTED TRANSMISSION</span>
                <p className="info-value">dispatch@nomadoutdoor.exp</p>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">🕒</span>
              <div>
                <span className="info-label">RADIO MONITORING HOURS</span>
                <p className="info-value">06:00 - 20:00 IST (UTC +5:30)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Form */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>RIDER NAME *</label>
                <input
                  type="text"
                  name="riderName"
                  placeholder="e.g. Marc Vance"
                  value={formData.riderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>EXPEDITION OBJECTIVE / TOPIC</label>
              <select name="topic" value={formData.topic} onChange={handleChange}>
                <option value="Technical Gear Sizing & Armor Guidance">Technical Gear Sizing & Armor Guidance</option>
                <option value="High-Altitude Route Consultation">High-Altitude Route Consultation</option>
                <option value="Custom Motorcycle Luggage Mounts">Custom Motorcycle Luggage Mounts</option>
                <option value="Warranty & Field Repair Inquiries">Warranty & Field Repair Inquiries</option>
              </select>
            </div>

            <div className="form-group">
              <label>TRANSMISSION DETAILS *</label>
              <textarea
                name="details"
                rows="4"
                placeholder="Specify your terrain, ride duration, and equipment requirements..."
                value={formData.details}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
              />
              <label htmlFor="subscribe">
                Include telemetry weather briefings and new collection alerts.
              </label>
            </div>

            <button type="submit" className="submit-btn">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;