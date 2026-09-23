import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  removeFromWishlist,
  clearWishlist,
} from "../../redux/slice/wishlistSlice";

import { addToCart } from "../../redux/slice/cartSlice";

import formatPrice from "../../utils/formatPrice";

import "./Wishlist.css";

export default function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const handleMoveToCart = (item) => {
    if (item.stock === 0) return;

    const alreadyAdded = cartItems.some(
      (cartItem) => cartItem.id === item.id
    );

    if (alreadyAdded) {
      toast("Already added.");
      return;
    }

    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(item.id));

    toast.success("Added to your cart");
  };

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast("Removed from wishlist.");
  };

  if (wishlistItems.length === 0) {
  return (
    <main className="wishlist-page">

      <div className="wishlist-header wishlist-header-empty">

        <div>
          <span className="wishlist-eyebrow">
            YOUR FIELD KIT
          </span>

          <h1>WISHLIST</h1>

          <p>
            Equipment you've saved for your next expedition.
          </p>
        </div>

      </div>

      <div className="wishlist-empty">

        <span className="material-symbols-outlined wishlist-empty-icon">
          favorite_border
        </span>

        <h2>Your wishlist is empty</h2>

        <p>
          Save equipment you want to keep an eye on.
        </p>

        <Link
          to="/products"
          className="wishlist-shop-button"
        >
          EXPLORE PRODUCTS
        </Link>

      </div>

    </main>
  );
}

  return (
    <main className="wishlist-page">

      <div className="wishlist-header">
        <div>
          <span className="wishlist-eyebrow">
            YOUR FIELD KIT
          </span>

          <h1>WISHLIST</h1>

          <p>
            Equipment you've saved for your next expedition.
          </p>
        </div>

        <button
          className="clear-wishlist-button"
          onClick={() => {
            dispatch(clearWishlist());
            toast("Wishlist cleared.");
          }}
        >
          CLEAR WISHLIST
        </button>
      </div>

      <div className="wishlist-grid">

        {wishlistItems.map((item) => (

          <article
            key={item.id}
            className="wishlist-card"
          >

            <div className="wishlist-image-wrapper">

              <Link to={`/products/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="wishlist-image"
                />
              </Link>

              <button
                className="wishlist-remove-icon"
                onClick={() => handleRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                type="button"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>

            </div>

            <div className="wishlist-card-body">

              <span className="wishlist-category">
                {item.category}
              </span>

              <Link
                to={`/products/${item.id}`}
                className="wishlist-product-name"
              >
                {item.name}
              </Link>

              {item.rating && (
                <div className="wishlist-rating">
                  <span>★</span>
                  {item.rating} / 5
                </div>
              )}

              <p className="wishlist-description">
                {item.description}
              </p>

              <div className="wishlist-card-footer">

                <span className="wishlist-price">
                  {formatPrice(item.price)}
                </span>

                <button
                  type="button"
                  className={`wishlist-cart-button ${
                    item.stock === 0
                      ? "disabled"
                      : ""
                  }`}
                  disabled={item.stock === 0}
                  onClick={() => handleMoveToCart(item)}
                >
                  {item.stock === 0
                    ? "OUT OF STOCK"
                    : "MOVE TO CART"}
                </button>

              </div>

            </div>

          </article>

        ))}

      </div>

    </main>
  );
}