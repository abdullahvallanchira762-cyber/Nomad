import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchUserOrders,
  cancelOrder,
} from "../../redux/slice/orderSlice";

import formatPrice from "../../utils/formatPrice";

import "./Order.css";

export default function Orders() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  // CANCEL ORDER
  const handleCancelOrder = async (order) => {
    const status = (order.status || "Placed").toLowerCase();

    // Prevent cancellation of completed/non-cancellable orders
    if (
      status === "shipped" ||
      status === "delivered" ||
      status === "cancelled"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.id}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(cancelOrder(order.id)).unwrap();

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Unable to cancel the order");
    }
  };

  // LOADING
  if (loading) {
    return (
      <main className="orders-page">
        <p className="orders-message">
          Loading your expedition orders...
        </p>
      </main>
    );
  }

  // ERROR
  if (error) {
    return (
      <main className="orders-page">
        <p className="orders-error">
          {error}
        </p>
      </main>
    );
  }

  // EMPTY
  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-header">
          <span className="orders-eyebrow">
            YOUR EXPEDITION LOG
          </span>

          <h1>ORDERS</h1>

          <p>
            Track the equipment you've ordered for your expeditions.
          </p>
        </div>

        <div className="orders-empty">
          <span className="material-symbols-outlined">
            inventory_2
          </span>

          <h2>No orders yet</h2>

          <p>
            Your completed purchases will appear here.
          </p>

          <Link to="/products">
            EXPLORE PRODUCTS
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">

      {/* HEADER */}
      <div className="orders-header">
        <span className="orders-eyebrow">
          YOUR EXPEDITION LOG
        </span>

        <h1>ORDERS</h1>

        <p>
          Track the equipment you've ordered for your expeditions.
        </p>
      </div>

      {/* ORDERS */}
      <div className="orders-list">

        {orders.map((order) => {

          const orderStatus = (
            order.status || "Placed"
          ).toLowerCase();

          const canCancel = [
            "placed",
            "pending",
            "processing",
          ].includes(orderStatus);

          return (
            <article
              key={order.id}
              className="order-card"
            >

              {/* ORDER HEADER */}
              <div className="order-card-header">

                <div>
                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order.id}
                  </h2>
                </div>

                <div className="order-status">
                  {order.status || "Placed"}
                </div>

              </div>

              {/* ORDER META */}
              <div className="order-meta">

                <div>
                  <span>DATE</span>

                  <strong>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>ITEMS</span>

                  <strong>
                    {order.items?.length || 0}
                  </strong>
                </div>

                <div>
                  <span>TOTAL</span>

                  <strong>
                    {formatPrice(
                      Number(order.total || 0)
                    )}
                  </strong>
                </div>

              </div>

              {/* PRODUCTS */}
              <div className="order-products">

                {order.items?.map((item) => (
                  <div
                    className="order-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="order-product-info">

                      <Link
                        to={`/products/${item.id}`}
                      >
                        {item.name}
                      </Link>

                      <p>
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <strong>
                      {formatPrice(
                        Number(item.price) *
                          Number(item.quantity)
                      )}
                    </strong>

                  </div>
                ))}

              </div>

              {/* SHIPPING */}
              <div className="order-shipping">

                <span>SHIPPING TO</span>

                <p>
                  {order.shippingAddress?.address}
                  {", "}
                  {order.shippingAddress?.city}
                  {", "}
                  {order.shippingAddress?.state}
                  {" - "}
                  {order.shippingAddress?.pincode}
                </p>

              </div>

              {/* ACTIONS */}
              {canCancel && (
                <div className="order-actions">

                  <button
                    type="button"
                    className="cancel-order-btn"
                    onClick={() =>
                      handleCancelOrder(order)
                    }
                  >
                    CANCEL ORDER
                  </button>

                </div>
              )}

            </article>
          );
        })}

      </div>

    </main>
  );
}