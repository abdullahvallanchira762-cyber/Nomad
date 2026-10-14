import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { setCartUser } from "../redux/slice/cartSlice";
import { setWishlistUser } from "../redux/slice/wishlistSlice";

function UserLayout() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const admin = useSelector((state) => state.adminAuth.admin);
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated
  );

  const isAdminLoggedIn = Boolean(
    isAuthenticated &&
    admin &&
    admin.role === "admin" &&
    admin.status === "active"
  );

  useEffect(() => {
    const userId = user?.id || null;

    dispatch(setCartUser(userId));
    dispatch(setWishlistUser(userId));
  }, [dispatch, user]);

  return (
    <>
      <Navbar showAdminPanel={isAdminLoggedIn} />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default UserLayout;