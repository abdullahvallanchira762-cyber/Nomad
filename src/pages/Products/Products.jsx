import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchProducts,
  setCategory,
  setSort,
} from "../../redux/slice/productSlice";

import { addToCart } from "../../redux/slice/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slice/wishlistSlice";

import formatPrice from "../../utils/formatPrice";

import "./Products.css";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryFromUrl =
  searchParams.get("category");
  // =========================================================
  // AUTH
  // =========================================================

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  // =========================================================
  // CART
  // =========================================================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // =========================================================
  // PRODUCTS
  // =========================================================

  const {
    items,
    loading,
    error,
    filters,
  } = useSelector(
    (state) => state.products
  );

  // =========================================================
  // WISHLIST
  // =========================================================

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

//Categories from URL 

  useEffect(() => {
  dispatch(
    setCategory(categoryFromUrl || "All")
  );

  setCurrentPage(1);
}, [dispatch, categoryFromUrl]);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = [
    "All",
    ...new Set(
      items.map((product) => product.category)
    ),
  ];

  // =========================================================
  // SEARCH + FILTER + SORT
  // =========================================================

  const filtered = [...items]
    .filter((product) => {
      if (filters.category === "All") {
        return true;
      }

      return (
        product.category === filters.category
      );
    })
    .filter((product) => {
      return product.name
        .toLowerCase()
        .includes(
          filters.search.toLowerCase()
        );
    })
    
    .sort((a, b) => {
  if (filters.sort === "low-high") {
    return Number(a.price) - Number(b.price);
  }

  if (filters.sort === "high-low") {
    return Number(b.price) - Number(a.price);
  }

  if (filters.sort === "high-rating") {
    return Number(b.rating) - Number(a.rating);
  }

  if (filters.sort === "low-rating") {
    return Number(a.rating) - Number(b.rating);
  }

  return 0;
});

    

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filtered.length / itemsPerPage
  );

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast("Please login to continue.");

      navigate("/login");

      return;
    }

    if (product.stock === 0) {
      return;
    }

    const alreadyAdded = cartItems.some(
      (item) => item.id === product.id
    );

    if (alreadyAdded) {
      toast("Already added.");

      return;
    }

    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );

    toast.success(
      "Added to your cart"
    );
  };

  // =========================================================
  // WISHLIST
  // =========================================================

  const handleWishlist = (product) => {
    if (!isAuthenticated) {
      toast("Please login to continue.");

      navigate("/login");

      return;
    }

    const isWishlisted =
      wishlistItems.some(
        (item) => item.id === product.id
      );

    if (isWishlisted) {
      dispatch(
        removeFromWishlist(product.id)
      );

      toast("Removed from wishlist");
    } else {
      dispatch(
        addToWishlist(product)
      );

      toast.success(
        "Added to wishlist"
      );
    }
  };

  // =========================================================
  // CHECK WISHLIST
  // =========================================================

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.id === productId
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <span className="products-eyebrow">
        INVENTORY & FIELD GEAR
      </span>

      <h2 className="products-title">
        PRODUCTS CATALOG
      </h2>

      {/* =================================================
          CATEGORY / SORT
      ================================================= */}

      <div className="products-controls">

        {/* CATEGORY */}

        <select
          value={filters.category}
          onChange={(e) => {
            dispatch(
              setCategory(e.target.value)
            );

            setCurrentPage(1);
          }}
          className="products-select"
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {/* SORT */}

        <select
          value={filters.sort}
          onChange={(e) => {
            dispatch(
              setSort(e.target.value)
            );

            setCurrentPage(1);
          }}
          className="products-select"
          aria-label="Sort products"
        >
          <option value="default">
            Sort: Default
          </option>

          <option value="low-high">
            Price: Low to High
          </option>

          <option value="high-low">
            Price: High to Low
          </option>

           <option value="high-rating">
            Rating: High to Low
          </option>

          <option value="low-rating">
            Rating: Low to High
          </option>

        </select>

      </div>

      {/* =================================================
          ACTIVE SEARCH MESSAGE
      ================================================= */}

      {filters.search && (
        <div className="products-search-status">
          SEARCH RESULTS FOR:
          <strong>
            "{filters.search}"
          </strong>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <p className="products-message">
          Retrieving equipment from db.json...
        </p>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <p className="products-error">
          Error communicating with server: {error}
        </p>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        filtered.length === 0 && (
          <p className="products-message">
            No equipment matches the selected
            parameters.
          </p>
        )}

      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      <div className="products-grid">

        {currentItems.map((item) => {

          const isFavorite =
            isInWishlist(item.id);

          const isInCart =
            cartItems.some(
              (cartItem) =>
                cartItem.id === item.id
            );

          return (
            <div
              key={item.id}
              className="product-card"
            >

              {/* IMAGE */}

              <div className="product-image-wrapper">

                <Link
                  to={`/products/${item.id}`}
                  className="product-image-link"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-card-image"
                  />
                </Link>

                {/* WISHLIST */}

                <button
                  type="button"
                  className={`product-wishlist ${
                    isFavorite
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleWishlist(item)
                  }
                  aria-label={
                    isFavorite
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  title={
                    isFavorite
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <span className="material-symbols-outlined">
                    favorite
                  </span>
                </button>

              </div>

              {/* CATEGORY */}

              <span className="product-category">
                {item.category}
              </span>

              {/* NAME */}

              <h3 className="product-name">
                {item.name}
              </h3>

              {/* DESCRIPTION */}

              <p className="product-description">
                {item.description}
              </p>

              {/* BOTTOM */}

              <div className="product-bottom">

                <span className="product-price">
                  {formatPrice(item.price)}
                </span>

                <button
                  type="button"
                  disabled={
                    item.stock === 0
                  }
                  onClick={() =>
                    handleAddToCart(item)
                  }
                  className={`add-cart-button ${
                    isInCart
                      ? "added"
                      : ""
                  }`}
                >
                  {item.stock === 0
                    ? "OUT OF STOCK"
                    : isInCart
                    ? "ADDED TO CART"
                    : "ADD TO CART"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      {!loading &&
        totalPages > 1 && (
          <div className="pagination">

            {/* PREVIOUS */}

            <button
              type="button"
              className="pagination-arrow"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
            >
              ←
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={`pagination-number ${
                  currentPage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            {/* NEXT */}

            <button
              type="button"
              className="pagination-arrow"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
            >
              →
            </button>

          </div>
        )}

    </div>
  );
}