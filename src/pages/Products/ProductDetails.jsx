import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchProductById,
  fetchProducts,
  clearSelectedProduct,
} from "../../redux/slice/productSlice";

import { addToCart, updateQuantity } from "../../redux/slice/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slice/wishlistSlice";

import formatPrice from "../../utils/formatPrice";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const {
    items: allProducts,
    selectedProduct,
    detailsLoading,
    detailsError,
  } = useSelector((state) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync product data on route parameter change
  useEffect(() => {
    dispatch(fetchProductById(id));
    setDetailImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  // Ensure all products are loaded for related products section
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, allProducts]);

  // Check if item already exists in cart or wishlist
  const existingCartItem = useMemo(() => {
    return cartItems.find(
      (item) => String(item.id) === String(selectedProduct?.id)
    );
  }, [cartItems, selectedProduct?.id]);

  const isInCart = Boolean(existingCartItem);

  const isWishlisted = useMemo(() => {
    return wishlistItems.some(
      (item) => String(item.id) === String(selectedProduct?.id)
    );
  }, [wishlistItems, selectedProduct?.id]);

  // Sync local quantity if product is already in cart
  useEffect(() => {
    if (existingCartItem && existingCartItem.quantity) {
      setQuantity(existingCartItem.quantity);
    }
  }, [existingCartItem]);

  /* =========================================
     PRODUCT IMAGES & GALLERY
  ========================================= */
  const productImages = useMemo(() => {
    if (!selectedProduct) return [];

    const rawList =
      Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
        ? selectedProduct.images
        : selectedProduct.image
        ? [selectedProduct.image]
        : [];

    const validList = rawList.filter(
      (img) => typeof img === "string" && img.trim() !== ""
    );

    if (validList.length === 0 && selectedProduct.image) {
      validList.push(selectedProduct.image);
    }

    return validList;
  }, [selectedProduct]);

  // Keep index clamped within bounds if image count changes
  const safeImageIndex =
    productImages.length > 0
      ? Math.min(detailImageIndex, productImages.length - 1)
      : 0;

  const handlePrevImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (productImages.length <= 1) return;
    setDetailImageIndex((prev) =>
      prev <= 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (productImages.length <= 1) return;
    setDetailImageIndex((prev) =>
      prev >= productImages.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation on gallery
  const handleGalleryKeyDown = (e) => {
    if (productImages.length <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevImage();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNextImage();
    }
  };

  // Mobile touch swipe gestures
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || productImages.length <= 1) return;
    if (e.changedTouches && e.changedTouches[0]) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (diff > 40) {
        handleNextImage();
      } else if (diff < -40) {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  /* =========================================
     QUANTITY SELECTOR
  ========================================= */
  const handleQuantityChange = (value) => {
    if (!selectedProduct || selectedProduct.stock <= 0) return;

    const newQuantity = Math.max(
      1,
      Math.min(value, selectedProduct.stock)
    );

    setQuantity(newQuantity);

    if (isInCart) {
      dispatch(
        updateQuantity({
          id: selectedProduct.id,
          quantity: newQuantity,
        })
      );
    }
  };

  /* =========================================
     CART ACTION
  ========================================= */
  const handleAddToCart = () => {
    if (isSubmitting) return;

    if (!isAuthenticated) {
      toast("Please login to continue.");
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
          },
        },
      });
      return;
    }

    if (!selectedProduct || selectedProduct.stock === 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (isInCart) {
      toast("Already added.");
      return;
    }

    setIsSubmitting(true);
    try {
      dispatch(
        addToCart({
          ...selectedProduct,
          quantity,
        })
      );
      toast.success("Added to your cart");
    } finally {
      setTimeout(() => setIsSubmitting(false), 300);
    }
  };

  /* =========================================
     WISHLIST ACTION
  ========================================= */
  const handleWishlist = () => {
    if (!selectedProduct || isSubmitting) return;

    if (!isAuthenticated) {
      toast("Please login to use the wishlist.");
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
          },
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isWishlisted) {
        dispatch(removeFromWishlist(selectedProduct.id));
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlist(selectedProduct));
        toast.success("Added to wishlist");
      }
    } finally {
      setTimeout(() => setIsSubmitting(false), 300);
    }
  };

  /* =========================================
     RELATED PRODUCTS
  ========================================= */
  const relatedProducts = useMemo(() => {
    if (!selectedProduct || !allProducts || allProducts.length === 0) {
      return [];
    }

    const otherProducts = allProducts.filter(
      (item) => String(item.id) !== String(selectedProduct.id)
    );

    // Prefer current product category
    const sameCategory = otherProducts.filter(
      (item) => item.category === selectedProduct.category
    );

    // Fill missing category slots with other categories
    const differentCategory = otherProducts.filter(
      (item) => item.category !== selectedProduct.category
    );

    return [...sameCategory, ...differentCategory].slice(0, 4);
  }, [allProducts, selectedProduct]);

  /* =========================================
     LOADING & ERROR STATES
  ========================================= */
  if (detailsLoading) {
    return (
      <div className="product-details-state">
        <p>Loading product...</p>
      </div>
    );
  }

  if (detailsError || !selectedProduct) {
    return (
      <div className="product-details-state">
        <h2>Product Not Found</h2>
        <p>
          {detailsError || "The requested product could not be found."}
        </p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <section className="product-details-page">
      <div className="product-details-container">
        {/* Breadcrumb */}
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{selectedProduct.name}</span>
        </nav>

        <div className="product-details-grid">
          {/* Product Gallery Section */}
          <div className="product-gallery-section">
            <div
              className="product-details-image-wrapper"
              tabIndex={0}
              role="region"
              aria-label={`${selectedProduct.name} image gallery`}
              onKeyDown={handleGalleryKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={
                  productImages[safeImageIndex] ||
                  selectedProduct.image ||
                  "/images/products/helmet.png"
                }
                alt={`${selectedProduct.name} view ${safeImageIndex + 1}`}
                className="product-details-image"
                onError={(e) => {
                  if (
                    selectedProduct.image &&
                    e.currentTarget.src !== selectedProduct.image
                  ) {
                    e.currentTarget.src = selectedProduct.image;
                  }
                }}
              />

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-nav-button gallery-nav-prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    title="Previous image"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>

                  <button
                    type="button"
                    className="gallery-nav-button gallery-nav-next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    title="Next image"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </>
              )}

              {selectedProduct.stock === 0 && (
                <span className="product-stock-overlay">
                  OUT OF STOCK
                </span>
              )}

              {productImages.length > 1 && (
                <div className="detail-image-counter" aria-live="polite">
                  {safeImageIndex + 1} / {productImages.length}
                </div>
              )}
            </div>

            {/* Clickable Thumbnails */}
            {productImages.length > 1 && (
              <div
                className="product-thumbnails-list"
                role="tablist"
                aria-label="Product thumbnails"
              >
                {productImages.map((imagePath, index) => (
                  <button
                    key={`${imagePath}-${index}`}
                    type="button"
                    role="tab"
                    id={`thumb-${index}`}
                    aria-selected={index === safeImageIndex}
                    aria-label={`View image ${index + 1} of ${productImages.length}`}
                    className={`product-thumbnail-item ${
                      index === safeImageIndex ? "active" : ""
                    }`}
                    onClick={() => setDetailImageIndex(index)}
                  >
                    <img
                      src={imagePath}
                      alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0.3";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="product-details-info">
            <span className="product-details-category">
              {selectedProduct.category}
            </span>

            <h1>{selectedProduct.name}</h1>

            <div className="product-rating">
              <span>★</span>
              <strong>{selectedProduct.rating}</strong>
              <span>/ 5</span>
            </div>

            <div className="product-details-price">
              {formatPrice(selectedProduct.price)}
            </div>

            <p className="product-details-description">
              {selectedProduct.description}
            </p>

            <div className="product-meta">
              <div>
                <span>Duration</span>
                <strong>{selectedProduct.duration}</strong>
              </div>

              <div>
                <span>Difficulty</span>
                <strong>{selectedProduct.difficulty}</strong>
              </div>

              <div>
                <span>Available</span>
                <strong>{selectedProduct.stock} units</strong>
              </div>
            </div>

            {selectedProduct.stock > 0 ? (
              <div className="product-purchase">
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= selectedProduct.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={`add-cart-button ${isInCart ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isSubmitting}
                >
                  {isInCart ? "ADDED TO CART" : "ADD TO CART"}
                </button>

                <button
                  type="button"
                  className={`wishlist-button ${
                    isWishlisted ? "wishlist-active" : ""
                  }`}
                  onClick={handleWishlist}
                  disabled={isSubmitting}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  title={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {isWishlisted ? "♥" : "♡"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="out-of-stock-button"
                disabled
              >
                OUT OF STOCK
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            TASK 3 — RELATED PRODUCTS SECTION
        ========================================= */}
        {relatedProducts.length > 0 && (
          <section
            className="related-products-section"
            aria-labelledby="related-products-title"
          >
            <div className="related-products-header">
              <span className="related-eyebrow">NOMAD SELECTION</span>
              <h2 id="related-products-title">RELATED EXPEDITION GEAR</h2>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="related-product-card"
                >
                  <div className="related-card-image-box">
                    <Link
                      to={`/products/${relProduct.id}`}
                      className="related-card-image-link"
                      aria-label={`View ${relProduct.name}`}
                    >
                      <img
                        src={
                          relProduct.image ||
                          (Array.isArray(relProduct.images) &&
                            relProduct.images[0]) ||
                          "/images/products/helmet.png"
                        }
                        alt={relProduct.name}
                        className="related-card-image"
                        loading="lazy"
                        onError={(e) => {
                          if (
                            relProduct.image &&
                            e.currentTarget.src !== relProduct.image
                          ) {
                            e.currentTarget.src = relProduct.image;
                          }
                        }}
                      />
                    </Link>

                    {relProduct.stock === 0 && (
                      <span className="related-stock-tag">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>

                  <div className="related-card-body">
                    <span className="related-card-category">
                      {relProduct.category}
                    </span>

                    <h3 className="related-card-title">
                      <Link to={`/products/${relProduct.id}`}>
                        {relProduct.name}
                      </Link>
                    </h3>

                    <div className="related-card-footer">
                      <span className="related-card-price">
                        {formatPrice(relProduct.price)}
                      </span>

                      <Link
                        to={`/products/${relProduct.id}`}
                        className="related-view-btn"
                      >
                        VIEW DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;