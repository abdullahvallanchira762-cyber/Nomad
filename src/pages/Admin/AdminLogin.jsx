import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { loginSuccess } from "../../redux/slice/authSlice";
import { loginUser } from "../../services/userService";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      dispatch(loginSuccess(user));

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
    <div>
      <h1>Nomad Admin</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Admin Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;