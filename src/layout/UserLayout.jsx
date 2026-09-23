import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { setCartUser } from "../redux/slice/cartSlice";
import { setWishlistUser } from "../redux/slice/wishlistSlice";

function UserLayout() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  useEffect(() => {
    const userId = user?.id || null;

    dispatch(setCartUser(userId));
    dispatch(setWishlistUser(userId));
  }, [dispatch, user]);

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default UserLayout;