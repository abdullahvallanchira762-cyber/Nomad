import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { placeOrder } from "../../redux/slice/orderSlice";
import { clearCart } from "../../redux/slice/cartSlice";

import formatPrice from "../../utils/formatPrice";

import "./Checkout.css";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const { loading } = useSelector(
    (state) => state.order
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "phone" || name === "pincode") {
    const numericValue = value.replace(/\D/g, "");

    setFormData({
      ...formData,
      [name]: numericValue,
    });

    return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderData = {
      userId: user.id,

      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },

      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },

      items: cartItems,

      total: Number(total.toFixed(2)),

      status: "Placed",

      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(placeOrder(orderData)).unwrap();

      dispatch(clearCart());

      toast.success("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      toast.error(error || "Failed to place order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <span className="material-symbols-outlined">
            shopping_cart
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Add some equipment before proceeding to checkout.
          </p>

          <Link to="/products">
            EXPLORE PRODUCTS
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-header">
        <span>SECURE EXPEDITION CHECKOUT</span>

        <h1>CHECKOUT</h1>

        <p>
          Confirm your details and shipping destination.
        </p>
      </div>

      <div className="checkout-layout">

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <section className="checkout-section">

            <h2>CONTACT DETAILS</h2>

            <div className="checkout-fields">

              <div className="checkout-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

          </section>

          <section className="checkout-section">

            <h2>SHIPPING ADDRESS</h2>

            <div className="checkout-fields">

              <div className="checkout-field full">
                <label>Address</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

          </section>

          <button
            type="submit"
            className="place-order-button"
            disabled={loading}
          >
            {loading
              ? "PLACING ORDER..."
              : "PLACE ORDER"}
          </button>

        </form>

        <aside className="checkout-summary">

          <h2>ORDER SUMMARY</h2>

          {cartItems.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>

                <p>
                  Qty: {item.quantity}
                </p>
              </div>

              <strong>
                {formatPrice(
                  Number(item.price) * Number(item.quantity)
                )}
              </strong>

            </div>
          ))}

          <div className="checkout-total">
            <span>TOTAL</span>

            <strong>
              {formatPrice(total)}
            </strong>
          </div>

        </aside>

      </div>

    </main>
  );
}