
import { Routes, Route, useLocation } from "react-router-dom";

import UserLayout from "../layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Products from "../pages/Products/Products";
import Story from "../pages/story/Story";

import ProductDetails from "../pages/Products/ProductDetails";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Order";

import PublicRoute from "./PublicRoute";

function AppRoutes() {
  const location = useLocation();

  /*
   * When Login/Register is opened from another page,
   * keep the previous page visible underneath.
   */
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<UserLayout />}>

          {/* Public routes */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* Login */}

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Register */}

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route path="/story" element={<Story />} />

          </Route>

        </Route>
      </Routes>

      {/* Render Login/Register over the existing page */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;