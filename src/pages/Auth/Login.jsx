
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginUser } from "../../services/userService";
import { loginSuccess } from "../../redux/slice/authSlice";

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

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

 const user = await loginUser(
  formData.email,
  formData.password
);

if (user.status === "blocked") {
  setError(
    "Your account has been blocked. Please contact Nomad support."
  );
  return;
}

dispatch(loginSuccess(user));

navigate(from, { replace: true });


    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop" onClick={handleClose} />

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

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              autoComplete="current-password"
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

