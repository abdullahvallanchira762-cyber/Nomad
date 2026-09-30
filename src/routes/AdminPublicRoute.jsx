import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminPublicRoute() {
  const { admin, isAuthenticated } = useSelector(
    (state) => state.adminAuth
  );

  // Already logged in as admin
  if (isAuthenticated && admin?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default AdminPublicRoute;