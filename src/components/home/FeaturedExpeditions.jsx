import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchProducts } from "../../redux/slice/productSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slice/wishlistSlice";

import { addToCart } from "../../redux/slice/cartSlice";

import formatPrice from "../../utils/formatPrice";

import "./FeaturedExpeditions.css";

export default function FeaturedExpeditions() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);
  

  const {
    items,
    loading,
    error,
  } = useSelector((state) => state.products);

  const cartItems = useSelector(
  (state) => state.cart.items
);

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [activeCategory, setActiveCategory] = useState("All");

const [hoveredProduct, setHoveredProduct] = useState(null);
const [hoverDirection, setHoverDirection] = useState(null);
const [imageIndexes, setImageIndexes] = useState({});

  /* =========================================
     WISHLIST
  ========================================= */

const toggleFavorite = (product) => {
  if (!isAuthenticated) {
    toast("Please login to continue.");
    navigate("/login");
    return;
  }

  const isFavorite = wishlistItems.some(
    (item) => item.id === product.id
  );

  if (isFavorite) {
    dispatch(removeFromWishlist(product.id));
    toast("Removed from wishlist");
  } else {
    dispatch(addToWishlist(product));
    toast.success("Added to wishlist");
  }
};

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = [
    "All",
    ...new Set(items.map((item) => item.category)),
  ];

  /* =========================================
     FEATURED PRODUCTS
  ========================================= */

  const featuredPool = items.some((p) => p.featured)
    ? items.filter((p) => p.featured)
    : items;

  const filtered =
    activeCategory === "All"
      ? featuredPool
      : featuredPool.filter(
          (item) => item.category === activeCategory
        );

  /* =========================================
     ADD TO CART 
  ========================================= */

const handleAddToCart = (product) => {
  if (!isAuthenticated) {
    toast("Please login to continue.");
    navigate("/login");
    return;
  }

  if (product.stock === 0) return;

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

  toast.success("Added to your cart");
};

/* =========================================
   HOVER IMAGE NAVIGATION
========================================= */

const getProductImages = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images.filter(
      (image) => image && image.trim() !== ""
    );
  }

  return product.image ? [product.image] : [];
};

const handleImageHover = (event, product) => {
  const images = getProductImages(product);

  if (images.length <= 1) {
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const middle = rect.width / 2;

  const direction =
    mouseX < middle ? "left" : "right";

  if (
    hoveredProduct === product.id &&
    hoverDirection === direction
  ) {
    return;
  }

  setHoveredProduct(product.id);
  setHoverDirection(direction);

  setImageIndexes((previous) => {
    const currentIndex =
      previous[product.id] ?? 0;

    let nextIndex = currentIndex;

    if (direction === "left") {
      nextIndex = Math.max(
        0,
        currentIndex - 1
      );
    }

    if (direction === "right") {
      nextIndex = Math.min(
        images.length - 1,
        currentIndex + 1
      );
    }

    return {
      ...previous,
      [product.id]: nextIndex,
    };
  });
};

const handleImageMouseLeave = (product) => {
  setHoveredProduct(null);
  setHoverDirection(null);

  setImageIndexes((previous) => ({
    ...previous,
    [product.id]: 0,
  }));
};

  return (
    <section className="featured-expeditions">

      {/* =========================================
          SECTION HEADER
      ========================================= */}

      <div className="section-header">

        <div>
          <span className="eyebrow">
            FIELD CATALOG
          </span>

          <h2>
            FEATURED EXPEDITIONS
          </h2>
        </div>

        <div className="filter-tabs">

          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${
                activeCategory === cat
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory(cat)
              }
            >
              {cat.toUpperCase()}
            </button>
          ))}

        </div>
      </div>


      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <p className="status-text">
          Relaying catalog from field server...
        </p>
      )}


      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <p className="status-text error">
          Telemetry Error: {error}
        </p>
      )}


      {/* =========================================
          PRODUCT CARDS
      ========================================= */}

      <div className="cards-grid">

        {filtered.map((item) => {

          const isFav = wishlistItems.some(
            (wishlistItem) =>
              wishlistItem.id === item.id
          );

          return (
            <article
              key={item.id}
              className="expedition-card"
            >

              {/* =========================================
                  IMAGE
              ========================================= */}
<div
  className="image-wrapper"
  onMouseMove={(event) =>
    handleImageHover(event, item)
  }
  onMouseLeave={() =>
    handleImageMouseLeave(item)
  }
>

  <Link
    to={`/products/${item.id}`}
    className="product-image-link"
  >
    <img
      src={
        getProductImages(item)[
          imageIndexes[item.id] ?? 0
        ] || item.image
      }
      alt={item.name}
    />
  </Link>

  {/* Hover navigation indicators */}
  {getProductImages(item).length > 1 && (
    <>
      <span className="image-hover-zone image-hover-zone-left" />
      <span className="image-hover-zone image-hover-zone-right" />
    </>
  )}

  {/* Category */}
  <span className="category-pill">
    {item.category}
  </span>

  {/* Wishlist */}
  <button
    type="button"
    className={`favorite-btn ${
      isFav ? "active" : ""
    }`}
    onClick={() => toggleFavorite(item)}
    title={
      isFav
        ? "Remove from favorites"
        : "Add to favorites"
    }
    aria-label={
      isFav
        ? "Remove from wishlist"
        : "Add to wishlist"
    }
  >
    <svg
      viewBox="0 0 24 24"
      fill={
        isFav
          ? "#e74c3c"
          : "none"
      }
      stroke={
        isFav
          ? "#e74c3c"
          : "#ffffff"
      }
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </button>

</div>


              {/* =========================================
                  CARD BODY
              ========================================= */}

              <div className="card-body">

                <div className="card-specs">

                  <span>
                    {item.duration ||
                      "Field Grade"}
                  </span>

                  <span>•</span>

                  <span>
                    {item.difficulty ||
                      "Mil-Spec"}
                  </span>

                </div>


                {/* Product name → Product Details */}
                <Link
                  to={`/products/${item.id}`}
                  className="product-title-link"
                >
                  <h3>{item.name}</h3>
                </Link>


                <p className="card-desc">
                  {item.description}
                </p>


                {/* =========================================
                    PRICE + CART
                ========================================= */}

                <div className="card-footer">

                  <span className="price">
                    {formatPrice(item.price)}
                  </span>

               <button
                  className={`btn-cart ${
                  cartItems.some((cartItem) => cartItem.id === item.id)
                  ? "added"
                  : ""
            }`}
                  disabled={item.stock === 0}
                  onClick={() => handleAddToCart(item)}
                  >   
                  {item.stock === 0
                  ? "SOLD OUT"
                  : cartItems.some((cartItem) => cartItem.id === item.id)
                  ? "ADDED TO CART"
                  : "ADD TO CART"}
              </button>

                </div>

              </div>

            </article>
          );
        })}

      </div>


      {/* =========================================
          VIEW ALL
      ========================================= */}

      <div className="view-all-wrapper">

        <Link
          to="/products"
          className="view-all-link"
        >
          VIEW ALL PRODUCTS &rarr;
        </Link>

      </div>

    </section>
  );
}