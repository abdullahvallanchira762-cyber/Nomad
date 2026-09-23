import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slice/cartSlice";

import formatPrice from "../../utils/formatPrice";

import "./Cart.css";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;

  const total = subtotal + shipping;

  const handleIncrease = (item) => {
    if (item.quantity < item.stock) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">

        <div className="cart-empty">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h1>Your Cart Is Empty</h1>

          <p>
            Your next adventure is waiting.
            Explore our expedition gear and
            find something for the journey.
          </p>

          <Link
            to="/products"
            className="cart-continue-button"
          >
            EXPLORE PRODUCTS
          </Link>

        </div>

      </section>
    );
  }

  return (
    <section className="cart-page">

      <div className="cart-container">

        {/* Header */}

        <div className="cart-header">

          <div>
            <span className="cart-eyebrow">
              YOUR GEAR
            </span>

            <h1>Shopping Cart</h1>

            <p>
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              ready for your next expedition.
            </p>
          </div>

          <button
            type="button"
            className="clear-cart-button"
            onClick={() => dispatch(clearCart())}
          >
            CLEAR CART
          </button>

        </div>

        <div className="cart-layout">

          {/* Cart Items */}

          <div className="cart-items">

            {cartItems.map((item) => {

              const itemTotal =
                item.price * item.quantity;

              return (
                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* Image */}

                  <Link
                    to={`/products/${item.id}`}
                    className="cart-item-image"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  {/* Information */}

                  <div className="cart-item-info">

                    <span className="cart-item-category">
                      {item.category}
                    </span>

                    <Link
                      to={`/products/${item.id}`}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>

                    <span className="cart-item-price">
                      {formatPrice(item.price)}
                    </span>

                    <span className="cart-item-stock">
                      {item.stock > 0
                        ? `${item.stock} available`
                        : "Out of stock"}
                    </span>

                  </div>

                  {/* Quantity */}

                  <div className="cart-item-quantity">

                    <span className="quantity-label">
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(item)
                        }
                        disabled={
                          item.quantity <= 1
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(item)
                        }
                        disabled={
                          item.quantity >=
                          item.stock
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Total */}

                  <div className="cart-item-total">

                    <span>
                      {formatPrice(itemTotal)}
                    </span>

                    <button
                      type="button"
                      className="remove-item-button"
                      onClick={() =>
                        handleRemove(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

          {/* Summary */}

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "FREE"
                  : formatPrice(shipping)}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default Cart;