import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slice/orderSlice";

import "./AdminOrders.css";

const ITEMS_PER_PAGE = 6;

const AdminOrders = () => {
  const dispatch = useDispatch();

  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.order);

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =========================================================
  // FETCH ALL ORDERS
  // =========================================================

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        String(order.id).toLowerCase().includes(search) ||
        order.customer?.name?.toLowerCase().includes(search) ||
        order.customer?.email?.toLowerCase().includes(search) ||
        order.customer?.phone?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // =========================================================
  // RESET PAGE WHEN SEARCH / FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // GET ITEM COUNT
  // =========================================================

  const getItemCount = (order) => {
    return (
      order.items?.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ) || 0
    );
  };

  // =========================================================
  // CLOSE ORDER DETAILS
  // =========================================================

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // =========================================================
  // TOGGLE SEARCH
  // =========================================================

  const toggleSearch = () => {
    setShowSearch((value) => !value);
  };

  // =========================================================
  // TOGGLE FILTER
  // =========================================================

  const toggleFilters = () => {
    setShowFilters((value) => !value);
  };

  return (
    <div className="admin-orders">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div className="admin-page-header-content">

          <p className="admin-page-eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p>
            Manage and review customer orders.
          </p>

        </div>

        {/* ===================================================
            SEARCH + FILTER
        =================================================== */}

        <div className="admin-orders-toolbar">

          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            className={`admin-search-wrapper ${
              showSearch ? "open" : ""
            }`}
          >

            <button
              type="button"
              className="admin-search-button"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <span className="material-symbols-outlined">
                search
              </span>
            </button>

            <div className="admin-search-box">

              <input
                type="text"
                placeholder="Search by order, customer or email..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>

          </div>

          {/* =================================================
              FILTER
          ================================================= */}

          <div className="admin-filter-wrapper">

            <button
              type="button"
              className={`admin-filter-button ${
                showFilters ? "active" : ""
              }`}
              onClick={toggleFilters}
              aria-label="Toggle filters"
            >
              <span className="material-symbols-outlined">
                tune
              </span>
            </button>

            {/* FILTER PANEL */}

            <div
              className={`admin-filter-panel ${
                showFilters ? "open" : ""
              }`}
            >

              <div className="admin-filter-panel-header">

                <span>FILTER</span>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(false)
                  }
                  aria-label="Close filters"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>

              </div>

              <div className="admin-filter-field">

                <label htmlFor="order-status-filter">
                  Status
                </label>

                <select
                  id="order-status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Placed">
                    Placed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="admin-error-state">

          <span className="material-symbols-outlined">
            error
          </span>

          <p>{error}</p>

        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="admin-loading-state">

          <span className="material-symbols-outlined">
            progress_activity
          </span>

          <p>Loading orders...</p>

        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        filteredOrders.length === 0 && (
          <div className="admin-empty-state">

            <span className="material-symbols-outlined">
              receipt_long
            </span>

            <h3>
              {orders.length === 0
                ? "No orders found"
                : "No matching orders"}
            </h3>

            <p>
              {orders.length === 0
                ? "There are currently no customer orders."
                : "Try changing your search or status filter."}
            </p>

          </div>
        )}

      {/* =====================================================
          ORDERS TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <>

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>

                  {paginatedOrders.map((order) => (

                    <tr key={order.id}>

                      {/* ORDER ID */}

                      <td>
                        <span className="admin-order-id">
                          #{order.id}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-customer-cell">

                          <strong>
                            {order.customer?.name ||
                              "Unknown"}
                          </strong>

                          <span>
                            {order.customer?.email ||
                              "—"}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(order.createdAt)}
                      </td>

                      {/* ITEMS */}

                      <td>
                        {getItemCount(order)}
                      </td>

                      {/* TOTAL */}

                      <td>
                        <strong>
                          {formatPrice(order.total)}
                        </strong>
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-order-status admin-order-status-${order.status
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.status || "Unknown"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="admin-view-button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                        >

                          <span className="material-symbols-outlined">
                            visibility
                          </span>

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <div className="admin-pagination">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                >

                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>

                  Previous

                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                >

                  Next

                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>

                </button>

              </div>
            )}

          </>
        )}

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (

        <div
          className="admin-order-modal-overlay"
          onClick={closeOrderDetails}
        >

          <div
            className="admin-order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-order-modal-header">

              <div>

                <p className="admin-page-eyebrow">
                  ORDER DETAILS
                </p>

                <h2>
                  #{selectedOrder.id}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeOrderDetails}
                aria-label="Close order details"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {/* CUSTOMER */}

            <div className="admin-order-detail-section">

              <h3>Customer</h3>

              <div className="admin-order-detail-grid">

                <div>
                  <span>Name</span>

                  <strong>
                    {selectedOrder.customer?.name ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {selectedOrder.customer?.email ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {selectedOrder.customer?.phone ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Order Date</span>

                  <strong>
                    {formatDate(
                      selectedOrder.createdAt
                    )}
                  </strong>
                </div>

              </div>

            </div>

            {/* SHIPPING ADDRESS */}

            <div className="admin-order-detail-section">

              <h3>Shipping Address</h3>

              <div className="admin-shipping-address">

                <p>
                  {selectedOrder.shippingAddress
                    ?.address || "—"}
                </p>

                <p>
                  {selectedOrder.shippingAddress
                    ?.city || "—"}
                  ,{" "}
                  {selectedOrder.shippingAddress
                    ?.state || "—"}
                </p>

                <p>
                  PIN:{" "}
                  {selectedOrder.shippingAddress
                    ?.pincode || "—"}
                </p>

              </div>

            </div>

            {/* ORDER ITEMS */}

            <div className="admin-order-detail-section">

              <h3>Order Items</h3>

              <div className="admin-order-items">

                {selectedOrder.items?.map((item) => (

                  <div
                    className="admin-order-item"
                    key={`${selectedOrder.id}-${item.id}`}
                  >

                    <div className="admin-order-item-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span className="material-symbols-outlined">
                          image
                        </span>
                      )}

                    </div>

                    <div className="admin-order-item-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.category}
                      </span>

                    </div>

                    <div className="admin-order-item-quantity">
                      Qty: {item.quantity || 0}
                    </div>

                    <div className="admin-order-item-price">

                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || 0)
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div className="admin-order-summary">

              <div>

                <span>Status</span>

                <strong>
                  {selectedOrder.status || "—"}
                </strong>

              </div>

              <div>

                <span>Total Items</span>

                <strong>
                  {getItemCount(selectedOrder)}
                </strong>

              </div>

              <div className="admin-order-grand-total">

                <span>Total</span>

                <strong>
                  {formatPrice(
                    selectedOrder.total
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminOrders;