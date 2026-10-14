import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slice/authSlice";
import { getUsers } from "../services/userService";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [accountBlocked, setAccountBlocked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let cancelled = false;

    const checkAccountStatus = async () => {
      try {
        const users = await getUsers();

        if (cancelled) return;

        const latestUser = users.find(
          (item) => String(item.id) === String(user.id)
        );

        // Treat a missing account as invalid.
        const isBlocked =
          !latestUser ||
          String(latestUser.status).toLowerCase() === "blocked" ||
          latestUser.isBlocked === true;

        if (isBlocked) {
          setAccountBlocked(true);
          dispatch(logout());
        }
      } catch (error) {
        // Keep the session during temporary network errors.
        console.error("Could not verify account status:", error);
      }
    };

    checkAccountStatus();

    const intervalId = setInterval(checkAccountStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [dispatch, isAuthenticated, user?.id]);

  if (accountBlocked) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ accountBlocked: true }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
