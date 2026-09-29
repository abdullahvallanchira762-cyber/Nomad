import { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchProductById,
  clearSelectedProduct,
} from "../../redux/slice/productSlice";

import { addToCart } from "../../redux/slice/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slice/wishlistSlice";

import formatPrice from "../../utils/formatPrice";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const [detailImageIndex, setDetailImageIndex] =
  useState(0);

const [detailHoverDirection, setDetailHoverDirection] =
  useState(null);

  const navigate = useNavigate();

const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

  const {
    selectedProduct,
    detailsLoading,
    detailsError,
  } = useSelector((state) => state.products);

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const isWishlisted = wishlistItems.some(
    (item) => item.id === selectedProduct?.id
  );

  const handleQuantityChange = (value) => {
    if (!selectedProduct) return;

    const newQuantity = Math.max(
      1,
      Math.min(value, selectedProduct.stock)
    );

    setQuantity(newQuantity);
  };

const handleAddToCart = () => {
  if (!isAuthenticated) {
    toast("Please login to continue.");
    navigate("/login");
    return;
  }

  if (!selectedProduct || selectedProduct.stock === 0) {
    return;
  }

  const alreadyAdded = cartItems.some(
    (item) => item.id === selectedProduct.id
  );

  if (alreadyAdded) {
    toast("Already added.");
    return;
  }

  dispatch(
    addToCart({
      ...selectedProduct,
      quantity,
    })
  );

  toast.success("Added to your cart");
};

const handleWishlist = () => {
  if (!selectedProduct) return;

  if (!isAuthenticated) {
    toast("Please login to use the wishlist.");

    navigate("/login", {
      state: {
        from: {
          pathname: `/products/${selectedProduct.id}`,
        },
      },
    });

    return;
  }

  if (isWishlisted) {
    dispatch(removeFromWishlist(selectedProduct.id));
    toast.success("Removed from wishlist");
  } else {
    dispatch(addToWishlist(selectedProduct));
    toast.success("Added to wishlist");
  }
};

/* =========================================
   PRODUCT DETAIL IMAGE GALLERY
========================================= */

const productImages =
  selectedProduct?.images &&
  selectedProduct.images.length > 0
    ? selectedProduct.images.filter(
        (image) =>
          image && image.trim() !== ""
      )
    : selectedProduct?.image
    ? [selectedProduct.image]
    : [];

const handleDetailImageHover = (event) => {
  if (productImages.length <= 1) {
    return;
  }

  const rect =
    event.currentTarget.getBoundingClientRect();

  const mouseX =
    event.clientX - rect.left;

  const middle = rect.width / 2;

  const direction =
    mouseX < middle ? "left" : "right";

  if (detailHoverDirection === direction) {
    return;
  }

  setDetailHoverDirection(direction);

  setDetailImageIndex((currentIndex) => {
    if (direction === "left") {
      return Math.max(0, currentIndex - 1);
    }

    return Math.min(
      productImages.length - 1,
      currentIndex + 1
    );
  });
};

const handleDetailImageLeave = () => {
  setDetailHoverDirection(null);
  setDetailImageIndex(0);
};

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
          {detailsError ||
            "The requested product could not be found."}
        </p>

        <Link to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="product-details-page">

      <div className="product-details-container">

        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>

          <span>/</span>

          <Link to="/products">
            Products
          </Link>

          <span>/</span>

          <span>{selectedProduct.name}</span>
        </div>

        <div className="product-details-grid">

          {/* Product Image */}
          <div
  className="product-details-image-wrapper"
  onMouseMove={handleDetailImageHover}
  onMouseLeave={handleDetailImageLeave}
>

  <img
    src={
      productImages[detailImageIndex] ||
      selectedProduct.image
    }
    alt={selectedProduct.name}
    className="product-details-image"
  />

  {productImages.length > 1 && (
    <>
      <span className="detail-hover-zone detail-hover-zone-left">
        <span className="material-symbols-outlined">
          chevron_left
        </span>
      </span>

      <span className="detail-hover-zone detail-hover-zone-right">
        <span className="material-symbols-outlined">
          chevron_right
        </span>
      </span>
    </>
  )}

  {selectedProduct.stock === 0 && (
    <span className="product-stock-overlay">
      OUT OF STOCK
    </span>
  )}

  {productImages.length > 1 && (
    <div className="detail-image-counter">
      {detailImageIndex + 1} / {productImages.length}
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

              <strong>
                {selectedProduct.rating}
              </strong>

              <span>
                / 5
              </span>
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
                <strong>
                  {selectedProduct.duration}
                </strong>
              </div>

              <div>
                <span>Difficulty</span>
                <strong>
                  {selectedProduct.difficulty}
                </strong>
              </div>

              <div>
                <span>Available</span>
                <strong>
                  {selectedProduct.stock} units
                </strong>
              </div>

            </div>

            {message && (
              <div className="product-action-message">
                {message}
              </div>
            )}

            {selectedProduct.stock > 0 ? (
              <div className="product-purchase">

                <div className="quantity-selector">

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        quantity - 1
                      )
                    }
                    disabled={quantity <= 1}
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        quantity + 1
                      )
                    }
                    disabled={
                      quantity >=
                      selectedProduct.stock
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  type="button"
                  className={`add-cart-button ${
                    cartItems.some(
                      (item) => item.id === selectedProduct.id
                    )
                      ? "added"
                      : ""
                  }`}
                  onClick={handleAddToCart}
                >
                  {cartItems.some(
                    (item) => item.id === selectedProduct.id
                  )
                    ? "ADDED TO CART"
                    : "ADD TO CART"}
                </button>

                <button
                  type="button"
                  className={`wishlist-button ${
                    isWishlisted
                      ? "wishlist-active"
                      : ""
                  }`}
                  onClick={handleWishlist}
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

      </div>

    </section>
  );
}

export default ProductDetails;