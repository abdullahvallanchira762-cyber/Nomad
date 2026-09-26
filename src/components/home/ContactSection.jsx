import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    riderName: "",
    email: "",
    topic: "Technical Gear Sizing & Armor Guidance",
    details: "",
    subscribe: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          riderName: formData.riderName,
          email: formData.email,
          topic: formData.topic,
          details: formData.details,
          subscribe: formData.subscribe
            ? "Yes"
            : "No",
        },
        {
          publicKey:
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      toast.success(
        "Transmission received successfully."
      );

      setFormData({
        riderName: "",
        email: "",
        topic:
          "Technical Gear Sizing & Armor Guidance",
        details: "",
        subscribe: false,
      });
    } catch (error) {
      console.error(
        "Contact form submission failed:",
        error
      );

      toast.error(
        "Transmission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">

        {/* LEFT COLUMN */}

        <div className="contact-info">
          <span className="contact-subtag">
            04 // BASECAMP DISPATCH
          </span>

          <h2 className="contact-title">
            LET’S PLAN YOUR NEXT EXPEDITION
          </h2>

          <p className="contact-description">
            Have a question about our equipment,
            fitment specs, or extreme endurance
            routes? Get in direct contact with our
            expedition gear coordinators.
          </p>

          <div className="info-cards">

            <div className="info-card">
              <span className="info-icon">
                📍
              </span>

              <div>
                <span className="info-label">
                  FIELD HQ
                </span>

                <p className="info-value">
                  Leh Ladakh Expedition Hub, Sector 4
                </p>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">
                📡
              </span>

              <div>
                <span className="info-label">
                  ENCRYPTED TRANSMISSION
                </span>

                <p className="info-value">
                  dispatch@nomadoutdoor.exp
                </p>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">
                🕒
              </span>

              <div>
                <span className="info-label">
                  RADIO MONITORING HOURS
                </span>

                <p className="info-value">
                  06:00 - 20:00 IST (UTC +5:30)
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="contact-form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="riderName">
                  RIDER NAME *
                </label>

                <input
                  id="riderName"
                  type="text"
                  name="riderName"
                  placeholder="e.g. Marc Vance"
                  value={formData.riderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  EMAIL ADDRESS *
                </label>

                <input
                  id="email"
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

              <label htmlFor="topic">
                EXPEDITION OBJECTIVE / TOPIC
              </label>

              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              >
                <option value="Technical Gear Sizing & Armor Guidance">
                  Technical Gear Sizing & Armor Guidance
                </option>

                <option value="High-Altitude Route Consultation">
                  High-Altitude Route Consultation
                </option>

                <option value="Custom Motorcycle Luggage Mounts">
                  Custom Motorcycle Luggage Mounts
                </option>

                <option value="Warranty & Field Repair Inquiries">
                  Warranty & Field Repair Inquiries
                </option>
              </select>

            </div>

            <div className="form-group">

              <label htmlFor="details">
                TRANSMISSION DETAILS *
              </label>

              <textarea
                id="details"
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
                Include telemetry weather briefings
                and new collection alerts.
              </label>

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "TRANSMITTING..."
                : "SEND MESSAGE"}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;