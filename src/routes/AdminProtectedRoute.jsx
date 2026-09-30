import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const { admin, isAuthenticated } = useSelector(
    (state) => state.adminAuth
  );

  const location = useLocation();

  // Admin is not logged in
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
  if (admin?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin account is blocked
  if (admin?.status === "blocked") {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin authenticated
  return <Outlet />;
}

export default AdminProtectedRoute;
