import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { adminLoginSuccess } from "../../redux/slice/adminAuthSlice";
import { loginUser } from "../../services/userService";

import "./AdminLogin.css";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      if (user.role !== "admin") {
        setError("You do not have admin access.");
        return;
      }

      if (user.status === "blocked") {
        setError("This admin account is blocked.");
        return;
      }

      dispatch(adminLoginSuccess(user));

      const redirectTo =
        location.state?.from?.pathname || "/admin";

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">

      <div
        className="admin-auth-backdrop"
        onClick={handleClose}
      />

      <div className="admin-auth-card">

        <button
          type="button"
          className="admin-auth-close"
          onClick={handleClose}
          aria-label="Close admin login"
        >
          ×
        </button>

        <div className="admin-auth-header">

          <div className="admin-logo">
  <img src="/images/logo/logo.png" alt="Nomad" />
</div>

          {/* <h3>
            ADMIN LOGIN
          </h3> */}

          <p>
            Sign in to manage your Nomad expedition store.
          </p>

        </div>

        {error && (
          <div className="admin-auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">

            <label htmlFor="admin-email">
              EMAIL
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              autoComplete="email"
              required
            />

          </div>

          <div className="admin-form-group">

            <label htmlFor="admin-password">
              PASSWORD
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              autoComplete="current-password"
              required
            />

          </div>

          <button
            type="submit"
            className="admin-auth-submit"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "ADMIN LOGIN"}
          </button>

        </form>

        <div className="admin-auth-footer">

          <span>
            NOMAD ADMIN PORTAL
          </span>

          <button
            type="button"
            onClick={handleClose}
          >
            BACK TO STORE
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;