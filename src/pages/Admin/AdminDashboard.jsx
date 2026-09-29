import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
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
     ORDER / USER CHART DATA
  ========================================================= */

  const activityData = useMemo(() => {
    const dataMap = {};

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().split("T")[0];

      if (!dataMap[key]) {
        dataMap[key] = {
          date: key,
          orders: 0,
          users: 0,
        };
      }

      dataMap[key].orders += 1;
    });

    users.forEach((user) => {
      if (!user.createdAt) return;

      const date = new Date(user.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().split("T")[0];

      if (!dataMap[key]) {
        dataMap[key] = {
          date: key,
          orders: 0,
          users: 0,
        };
      }

      dataMap[key].users += 1;
    });

    return Object.values(dataMap)
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      )
      .map((item) => ({
        ...item,
        label: new Date(
          item.date
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      }));
  }, [orders, users]);

  /* =========================================================
     STOCK CHART DATA
  ========================================================= */

  const stockData = useMemo(() => {
    return products
      .map((product) => ({
        name:
          product.name?.length > 18
            ? `${product.name.slice(0, 18)}...`
            : product.name,

        stock: Number(product.stock || 0),
      }))
      .sort((a, b) => b.stock - a.stock);
  }, [products]);

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
              ORDERS + USERS
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


            <div className="admin-chart">

              {activityData.length === 0 ? (

                <div className="admin-chart-empty">

                  <span className="material-symbols-outlined">
                    monitoring
                  </span>

                  <p>
                    No dated activity available
                  </p>

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={activityData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      stroke="rgba(242,239,231,0.08)"
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
                      stroke="#777872"
                      allowDecimals={false}
                      tick={{
                        fill: "#777872",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#1a1b1c",
                        border:
                          "1px solid rgba(242,239,231,0.12)",
                        borderRadius: "8px",
                        color: "#f2efe7",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="#c4a87c"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: "#c4a87c",
                      }}
                      activeDot={{
                        r: 5,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Users"
                      stroke="#a6a39b"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: "#a6a39b",
                      }}
                      activeDot={{
                        r: 5,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              )}

            </div>


            <div className="admin-chart-legend">

              <span>
                <i className="legend-orders" />
                Orders
              </span>

              <span>
                <i className="legend-users" />
                Users
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
                        fill: "rgba(242,239,231,0.04)",
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
                      radius={[0, 4, 4, 0]}
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