import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginUser } from "../../services/userService";
import { loginSuccess } from "../../redux/slice/authSlice";
import { adminLoginSuccess } from "../../redux/slice/adminAuthSlice";

import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";
  const accountBlocked = location.state?.accountBlocked === true;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(
        formData.email.trim(),
        formData.password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      const status = String(user.status || "").toLowerCase();

      if (status === "blocked" || user.isBlocked === true) {
        setError(
          "Your account has been blocked. Please contact Nomad support."
        );
        return;
      }

      // Admin and normal users use separate Redux authentication states.
      if (user.role === "admin") {
        if (status !== "active") {
          setError("This admin account is not active.");
          return;
        }

        dispatch(adminLoginSuccess(user));
      } else {
        dispatch(loginSuccess(user));
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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
          aria-label="Close login"
        >
          ×
        </button>

        <div className="auth-header">
          <span className="auth-eyebrow">NOMAD</span>

          <h1>WELCOME BACK</h1>

          <p>
            Login to continue your expedition.
          </p>
        </div>

        {accountBlocked && (
          <div className="auth-error" role="alert">
            Your account has been blocked by the administrator.
            Please contact Nomad support for assistance.
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="auth-footer">
          <span>NEW TO NOMAD?</span>

          <Link
            to="/register"
            state={{ from: location.state?.from }}
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
