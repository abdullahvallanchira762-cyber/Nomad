import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/userService";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const existingUsers = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users?email=${encodeURIComponent(
          formData.email
        )}`
      ).then((res) => res.json());

      if (existingUsers.length > 0) {
        setError("An account with this email already exists.");
        return;
      }

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login", {
        state: {
          backgroundLocation:
            location.state?.backgroundLocation,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        className="auth-backdrop"
        onClick={handleClose}
      />

      <div className="auth-card">

        <button
          type="button"
          className="auth-close"
          onClick={handleClose}
          aria-label="Close registration"
        >
          ×
        </button>

        <div className="auth-header">
          <span className="auth-eyebrow">
           NOMAD
          </span>

          <h1>CREATE ACCOUNT</h1>

          <p>
            Join Nomad and start your journey.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">
              NAME
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              CONFIRM PASSWORD
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "CREATING ACCOUNT..."
              : "CREATE ACCOUNT"}
          </button>

        </form>

        <div className="auth-footer">
          <span>
            ALREADY A MEMBER?
          </span>

          <Link
            to="/login"
            state={{
              backgroundLocation:
                location.state?.backgroundLocation,
            }}
          >
            LOGIN
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
