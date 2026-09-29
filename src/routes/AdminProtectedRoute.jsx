import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Logged in but not an admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin authenticated
  return <Outlet />;
}

export default AdminProtectedRoute;