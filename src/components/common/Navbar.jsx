import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { logout } from "../../redux/slice/authSlice";
import { setSearch } from "../../redux/slice/productSlice";

import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const accountRef = useRef(null);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  /* =========================================================
     AUTH
  ========================================================= */

  const { user, isAuthenticated } =
    useSelector((state) => state.auth);

  /* =========================================================
     CART
  ========================================================= */

  const { items: cartItems } =
    useSelector((state) => state.cart);

  /* =========================================================
     WISHLIST
  ========================================================= */

  const { items: wishlistItems } =
    useSelector((state) => state.wishlist);

  /* =========================================================
     SEARCH
  ========================================================= */

  const searchValue = useSelector(
    (state) => state.products.filters.search
  );

  /* =========================================================
     COUNTS
  ========================================================= */

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const wishlistCount =
    wishlistItems.length;

  /* =========================================================
     DESKTOP SEARCH
  ========================================================= */

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  /* =========================================================
     SEARCH CHANGE
  ========================================================= */

  const handleSearchChange = (e) => {
    const value = e.target.value;

    dispatch(setSearch(value));

    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  /* =========================================================
     DESKTOP SEARCH FOCUS
  ========================================================= */

  useEffect(() => {
    if (!searchOpen) return;

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  /* =========================================================
     MOBILE SEARCH FOCUS
  ========================================================= */

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [mobileSearchOpen]);

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const handleClearSearch = () => {
    dispatch(setSearch(""));

    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  };

  /* =========================================================
     ACCOUNT
  ========================================================= */

  const handleAccountToggle = () => {
    setAccountOpen(
      (previous) => !previous
    );

    setSearchOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  /* =========================================================
     OUTSIDE ACCOUNT CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(
      (previous) => !previous
    );

    setSearchOpen(false);
    setAccountOpen(false);
    setMobileSearchOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  /* =========================================================
     MOBILE SEARCH
  ========================================================= */

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(
      (previous) => !previous
    );

    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  };

  /* =========================================================
     CLOSE MENUS WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setSearchOpen(false);
      setAccountOpen(false);
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =========================================================
     NAVIGATION CLICK
  ========================================================= */

  const handleNavigationClick = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);

    dispatch(logout());

    navigate("/");
  };

  return (
    <header className="navbar">

      <div
        className={`navbar-container ${
          searchOpen
            ? "search-is-open"
            : ""
        }`}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="navbar-logo">
          <Link
            to="/"
            onClick={
              handleNavigationClick
            }
          >
            <img
              src="/images/logo/logo.png"
              alt="Nomad"
            />
          </Link>
        </div>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="navbar-links">

          <Link
            className="nav-link"
            to="/"
            onClick={
              handleNavigationClick
            }
          >
            Home
          </Link>

          <Link
            className="nav-link"
            to="/products"
            onClick={
              handleNavigationClick
            }
          >
            Products
          </Link>

          <Link
            className="nav-link"
            to="/story"
            onClick={
              handleNavigationClick
            }
          >
            Story
          </Link>

        </nav>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="navbar-actions">

          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

          <div
            className={`navbar-search-shell ${
              searchOpen
                ? "open"
                : ""
            }`}
          >

            <button
              type="button"
              className="navbar-search-trigger"
              onClick={handleOpenSearch}
              aria-label="Search products"
              title="Search products"
            >
              <span className="material-symbols-outlined">
                search
              </span>
            </button>

            <div className="navbar-search">

              <span className="material-symbols-outlined navbar-search-icon">
                search
              </span>

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="SEARCH EQUIPMENT..."
                aria-label="Search products"
              />

              {searchValue && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>
              )}

              <button
                type="button"
                className="navbar-search-close"
                onClick={handleCloseSearch}
                aria-label="Close search"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>

            </div>

          </div>

          {/* =================================================
              ACCOUNT
          ================================================= */}

          {isAuthenticated ? (

            <div
              className="navbar-account"
              ref={accountRef}
            >

              <button
                type="button"
                className={`navbar-account-trigger ${
                  accountOpen
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleAccountToggle
                }
                aria-expanded={
                  accountOpen
                }
                aria-label="Account menu"
              >

                <span className="material-symbols-outlined navbar-account-icon">
                  account_circle
                </span>

                <span className="navbar-account-name">
                  {user?.name ||
                    "ACCOUNT"}
                </span>

                <span className="material-symbols-outlined navbar-account-arrow">
                  expand_more
                </span>

              </button>

              {/* ACCOUNT DROPDOWN */}

              <div
                className={`navbar-account-menu ${
                  accountOpen
                    ? "open"
                    : ""
                }`}
              >

                <div className="navbar-account-header">

                  <span>
                    ACCOUNT
                  </span>

                  <strong>
                    {user?.name ||
                      "NOMAD USER"}
                  </strong>

                </div>

                <div className="navbar-account-divider" />

                <Link
                  to="/orders"
                  className="navbar-account-item"
                  onClick={() =>
                    setAccountOpen(false)
                  }
                >
                  <span className="material-symbols-outlined">
                    package_2
                  </span>

                  <span>
                    My Orders
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className="navbar-account-item"
                  onClick={() =>
                    setAccountOpen(false)
                  }
                >
                  <span className="material-symbols-outlined">
                    favorite
                  </span>

                  <span>
                    My Wishlist
                  </span>
                </Link>

                <div className="navbar-account-divider" />

                <button
                  type="button"
                  className="navbar-account-item navbar-account-logout"
                  onClick={
                    handleLogout
                  }
                >
                  <span className="material-symbols-outlined">
                    logout
                  </span>

                  <span>
                    Logout
                  </span>
                </button>

              </div>

            </div>

          ) : (

            <Link
              className="nav-action navbar-login"
              to="/login"
              aria-label="Account"
              title="Account"
            >
              <span className="material-symbols-outlined">
                account_circle
              </span>
            </Link>

          )}

          {/* =================================================
              WISHLIST
              Desktop / Tablet only
          ================================================= */}

          <Link
            className="nav-action wishlist-action desktop-wishlist"
            to="/wishlist"
            aria-label="Wishlist"
            title="Wishlist"
            onClick={
              handleNavigationClick
            }
          >
            <span className="material-symbols-outlined">
              favorite
            </span>

            {wishlistCount > 0 && (
              <span className="nav-badge wishlist-badge">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* =================================================
              CART
              Desktop / Tablet only
          ================================================= */}

          <Link
            className="nav-action cart-action"
            to="/cart"
            aria-label="Cart"
            title="Cart"
            onClick={
              handleNavigationClick
            }
          >
            <span className="material-symbols-outlined">
              shopping_bag
            </span>

            {cartCount > 0 && (
              <span className="nav-badge cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {/* =================================================
              MOBILE SEARCH
              Search stays OUTSIDE the menu
          ================================================= */}

          <button
            type="button"
            className="mobile-search-trigger"
            onClick={
              handleMobileSearchToggle
            }
            aria-label="Search products"
            title="Search products"
          >
            <span className="material-symbols-outlined">
              search
            </span>
          </button>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className={`mobile-menu-button ${
              mobileMenuOpen
                ? "active"
                : ""
            }`}
            onClick={
              handleMobileMenuToggle
            }
            aria-label="Open menu"
            aria-expanded={
              mobileMenuOpen
            }
          >
            <span className="mobile-menu-line" />
            <span className="mobile-menu-line" />
            <span className="mobile-menu-line" />
          </button>

        </div>

      </div>

      {/* =====================================================
          MOBILE SEARCH PANEL
      ===================================================== */}

      <div
        className={`mobile-search-panel ${
          mobileSearchOpen
            ? "open"
            : ""
        }`}
      >

        <div className="mobile-search-inner">

          <span className="material-symbols-outlined">
            search
          </span>

          <input
            ref={mobileSearchInputRef}
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="SEARCH EQUIPMENT..."
            aria-label="Search products"
          />

          {searchValue && (
            <button
              type="button"
              onClick={
                handleClearSearch
              }
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setMobileSearchOpen(false)
            }
            aria-label="Close search"
          >
            <span className="material-symbols-outlined">
              close
            </span>
          </button>

        </div>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-menu ${
          mobileMenuOpen
            ? "open"
            : ""
        }`}
      >

        <nav className="mobile-menu-navigation">

          <Link
            to="/"
            onClick={
              handleNavigationClick
            }
          >
            <span>01</span>
            HOME
          </Link>

          <Link
            to="/products"
            onClick={
              handleNavigationClick
            }
          >
            <span>02</span>
            PRODUCTS
          </Link>

          <Link
            to="/story"
            onClick={
              handleNavigationClick
            }
          >
            <span>03</span>
            STORY
          </Link>

          <button
            type="button"
            onClick={
              handleMobileSearchToggle
            }
          >
            <span>04</span>
            SEARCH
          </button>

          {/* CART INSIDE MOBILE MENU */}

          <Link
            to="/cart"
            onClick={
              handleNavigationClick
            }
          >
            <span>05</span>

            CART

            {cartCount > 0 && (
              <strong className="mobile-cart-count">
                {cartCount}
              </strong>
            )}
          </Link>

          {/* WISHLIST INSIDE MOBILE MENU */}

          <Link
            to="/wishlist"
            onClick={
              handleNavigationClick
            }
          >
            <span>06</span>

            WISHLIST

            {wishlistCount > 0 && (
              <strong className="mobile-cart-count">
                {wishlistCount}
              </strong>
            )}
          </Link>

        </nav>

        <div className="mobile-menu-divider" />

        {/* =================================================
            MOBILE ACCOUNT
        ================================================= */}

        <div className="mobile-account-section">

          <div className="mobile-account-heading">

            <span className="material-symbols-outlined">
              account_circle
            </span>

            <div>

              <small>
                ACCOUNT
              </small>

              <strong>
                {isAuthenticated
                  ? user?.name ||
                    "ACCOUNT"
                  : "GUEST"}
              </strong>

            </div>

          </div>

          {isAuthenticated ? (

            <div className="mobile-account-links">

              <Link
                to="/orders"
                onClick={
                  closeMobileMenu
                }
              >
                MY ORDERS
              </Link>

              <Link
                to="/wishlist"
                onClick={
                  closeMobileMenu
                }
              >
                MY WISHLIST
              </Link>

              <button
                type="button"
                onClick={
                  handleLogout
                }
              >
                LOGOUT
              </button>

            </div>

          ) : (

            <Link
              to="/login"
              className="mobile-login-link"
              onClick={
                closeMobileMenu
              }
            >
              LOGIN
            </Link>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;