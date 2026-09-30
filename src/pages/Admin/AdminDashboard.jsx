import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchProducts } from "../../redux/slice/productSlice";
import { fetchUsers } from "../../redux/slice/userSlice";
import { fetchAllOrders } from "../../redux/slice/orderSlice";

import "./AdminDashboard.css";

function AdminDashboard() {
  const dispatch = useDispatch();

  const [activityType, setActivityType] = useState("orders");

  /* =========================================================
     REDUX DATA
  ========================================================= */

  const products = useSelector(
    (state) => state.products?.items || []
  );

  const users = useSelector(
    (state) => state.user?.items || []
  );

  const orders = useSelector(
    (state) => state.order?.items || []
  );

  /* =========================================================
     FETCH ADMIN DATA
  ========================================================= */

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUsers());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  /* =========================================================
     TOTAL STOCK
  ========================================================= */

  const totalStock = useMemo(() => {
    return products.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );
  }, [products]);

  /* =========================================================
     REVENUE
  ========================================================= */

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );
  }, [orders]);

  /* =========================================================
     STOCK CHART DATA
  ========================================================= */

  const stockData = useMemo(() => {
    return products.map((product) => ({
      name: product.name,
      stock: Number(product.stock || 0),
    }));
  }, [products]);

  /* =========================================================
     ORDER / USER ACTIVITY DATA
  ========================================================= */

  const activityData = useMemo(() => {
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const key = [
        year,
        String(month + 1).padStart(2, "0"),
        String(day).padStart(2, "0"),
      ].join("-");

      /* -------------------------------------------------------
         ORDERS CREATED ON THIS DAY
      ------------------------------------------------------- */

      const orderCount = orders.filter((order) => {
        if (!order.createdAt) {
          return false;
        }

        const orderDate = new Date(order.createdAt);

        if (Number.isNaN(orderDate.getTime())) {
          return false;
        }

        return (
          orderDate.getFullYear() === year &&
          orderDate.getMonth() === month &&
          orderDate.getDate() === day
        );
      }).length;

      /* -------------------------------------------------------
         USERS CREATED ON THIS DAY
      ------------------------------------------------------- */

      const userCount = users.filter((user) => {
        if (!user.createdAt) {
          return false;
        }

        const userDate = new Date(user.createdAt);

        if (Number.isNaN(userDate.getTime())) {
          return false;
        }

        return (
          userDate.getFullYear() === year &&
          userDate.getMonth() === month &&
          userDate.getDate() === day
        );
      }).length;

      data.push({
        date: key,

        label: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),

        orders: orderCount,
        users: userCount,
      });
    }

    return data;
  }, [orders, users]);

  /* =========================================================
     PRICE FORMAT
  ========================================================= */

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  /* =========================================================
     TOOLTIP LABEL
  ========================================================= */

  const activityName =
    activityType === "orders"
      ? "Orders"
      : "Users";

  return (
    <section className="admin-dashboard">

      {/* =====================================================
          INTRO
      ===================================================== */}

      <div className="admin-dashboard-intro">

        <div>
          <span className="admin-section-eyebrow">
            OVERVIEW
          </span>

          <h2>
            Welcome back,
            <br />
            <span>Administrator.</span>
          </h2>
        </div>

        <p>
          Manage the Nomad expedition store,
          products, customers and orders from
          one place.
        </p>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="admin-stat-grid">

        {/* PRODUCTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">
            <span>PRODUCTS</span>

            <span className="material-symbols-outlined">
              inventory_2
            </span>
          </div>

          <strong>
            {products.length}
          </strong>

          <p>
            Total products
          </p>

        </div>


        {/* USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">
            <span>USERS</span>

            <span className="material-symbols-outlined">
              group
            </span>
          </div>

          <strong>
            {users.length}
          </strong>

          <p>
            Registered customers
          </p>

        </div>


        {/* ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">
            <span>ORDERS</span>

            <span className="material-symbols-outlined">
              receipt_long
            </span>
          </div>

          <strong>
            {orders.length}
          </strong>

          <p>
            Total orders
          </p>

        </div>


        {/* STOCK */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">
            <span>STOCK</span>

            <span className="material-symbols-outlined">
              warehouse
            </span>
          </div>

          <strong>
            {totalStock}
          </strong>

          <p>
            Items currently in stock
          </p>

        </div>


        {/* REVENUE */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">
            <span>REVENUE</span>

            <span className="material-symbols-outlined">
              payments
            </span>
          </div>

          <strong className="admin-stat-price">
            {formatPrice(totalRevenue)}
          </strong>

          <p>
            Total order value
          </p>

        </div>

      </div>


      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <div className="admin-dashboard-section">

        <div className="admin-section-heading">

          <div>
            <span className="admin-section-eyebrow">
              ANALYTICS
            </span>

            <h3>
              Store activity
            </h3>
          </div>

        </div>


        <div className="admin-chart-grid">

          {/* =================================================
              ORDERS / USERS ACTIVITY
          ================================================= */}

          <div className="admin-chart-card">

            <div className="admin-chart-header">

              <div>
                <strong>
                  Orders & Users
                </strong>

                <span>
                  Activity over time
                </span>
              </div>

              <span className="material-symbols-outlined">
                monitoring
              </span>

            </div>


            {/* =================================================
                ACTIVITY TOGGLE
            ================================================= */}

            <div className="admin-activity-toggle">

              <button
                type="button"
                className={
                  activityType === "orders"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActivityType("orders")
                }
              >
                Orders
              </button>

              <button
                type="button"
                className={
                  activityType === "users"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActivityType("users")
                }
              >
                Users
              </button>

            </div>


            {/* =================================================
                ACTIVITY CHART
            ================================================= */}

            <div className="admin-chart">

              {activityData.length === 0 ? (

                <div className="admin-chart-empty">

                  <span className="material-symbols-outlined">
                    monitoring
                  </span>

                  <p>
                    No activity available
                  </p>

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={activityData}
                    margin={{
                      top: 15,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >

                    <defs>

                      <linearGradient
                        id="activityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#c4a87c"
                          stopOpacity={0.28}
                        />

                        <stop
                          offset="100%"
                          stopColor="#c4a87c"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      stroke="rgba(242,239,231,0.07)"
                      vertical={false}
                    />


                    <XAxis
                      dataKey="label"
                      stroke="#777872"
                      tick={{
                        fill: "#777872",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <YAxis
                      allowDecimals={false}
                      stroke="#777872"
                      tick={{
                        fill: "#777872",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />


                    <Tooltip
                      cursor={{
                        stroke:
                          "rgba(196,168,124,0.25)",
                        strokeWidth: 1,
                      }}
                      contentStyle={{
                        background: "#1a1b1c",
                        border:
                          "1px solid rgba(242,239,231,0.12)",
                        borderRadius: "6px",
                        color: "#f2efe7",
                        fontSize: "11px",
                      }}
                      labelStyle={{
                        color: "#f2efe7",
                        marginBottom: "5px",
                      }}
                      itemStyle={{
                        color: "#c4a87c",
                      }}
                    />


                    <Area
                      type="monotone"
                      dataKey={activityType}
                      name={activityName}
                      stroke="#c4a87c"
                      strokeWidth={2}
                      fill="url(#activityGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 2,
                        fill: "#c4a87c",
                      }}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>


            {/* =================================================
                ACTIVITY FOOTER
            ================================================= */}

            <div className="admin-chart-footer">

              <span>
                <i className="legend-activity" />

                {activityType === "orders"
                  ? "Orders placed"
                  : "Users registered"}
              </span>

              <span>
                Last 7 days
              </span>

            </div>

          </div>


          {/* =================================================
              PRODUCT STOCK
          ================================================= */}

          <div className="admin-chart-card">

            <div className="admin-chart-header">

              <div>
                <strong>
                  Product Stock
                </strong>

                <span>
                  Current inventory levels
                </span>
              </div>

              <span className="material-symbols-outlined">
                inventory
              </span>

            </div>


            <div className="admin-stock-chart">

              {stockData.length === 0 ? (

                <div className="admin-chart-empty">

                  <span className="material-symbols-outlined">
                    inventory_2
                  </span>

                  <p>
                    No products available
                  </p>

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={stockData}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 15,
                      left: 0,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      stroke="rgba(242,239,231,0.08)"
                      horizontal={false}
                    />


                    <XAxis
                      type="number"
                      allowDecimals={false}
                      stroke="#777872"
                      tick={{
                        fill: "#777872",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      stroke="#777872"
                      tick={{
                        fill: "#a6a39b",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <Tooltip
                      cursor={{
                        fill:
                          "rgba(242,239,231,0.04)",
                      }}
                      contentStyle={{
                        background: "#1a1b1c",
                        border:
                          "1px solid rgba(242,239,231,0.12)",
                        borderRadius: "8px",
                        color: "#f2efe7",
                      }}
                    />


                    <Bar
                      dataKey="stock"
                      name="Stock"
                      fill="#c4a87c"
                      radius={[
                        0,
                        4,
                        4,
                        0,
                      ]}
                      barSize={14}
                    />

                  </BarChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}

      <div className="admin-dashboard-section">

        <div className="admin-section-heading">

          <div>
            <span className="admin-section-eyebrow">
              MANAGEMENT
            </span>

            <h3>
              Quick access
            </h3>
          </div>

        </div>


        <div className="admin-quick-grid">

          {/* PRODUCTS */}

          <a
            href="/admin/products"
            className="admin-quick-card"
          >

            <span className="material-symbols-outlined">
              inventory_2
            </span>

            <div>
              <strong>
                Products
              </strong>

              <span>
                Manage your expedition gear
              </span>
            </div>

            <span className="material-symbols-outlined arrow">
              arrow_forward
            </span>

          </a>


          {/* USERS */}

          <a
            href="/admin/users"
            className="admin-quick-card"
          >

            <span className="material-symbols-outlined">
              group
            </span>

            <div>
              <strong>
                Users
              </strong>

              <span>
                Manage customer accounts
              </span>
            </div>

            <span className="material-symbols-outlined arrow">
              arrow_forward
            </span>

          </a>


          {/* ORDERS */}

          <a
            href="/admin/orders"
            className="admin-quick-card"
          >

            <span className="material-symbols-outlined">
              receipt_long
            </span>

            <div>
              <strong>
                Orders
              </strong>

              <span>
                Review customer orders
              </span>
            </div>

            <span className="material-symbols-outlined arrow">
              arrow_forward
            </span>

          </a>

        </div>

      </div>

    </section>
  );
}

export default AdminDashboard;