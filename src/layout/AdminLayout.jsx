import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slice/authSlice";

import "./AdminLayout.css";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">

      {/* =========================================
          ADMIN SIDEBAR
      ========================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-top">

          {/* LOGO */}

<NavLink
  to="/admin"
  className="admin-brand"
>
  <img
    src="/images/logo/logo.png"
    alt="Nomad Outdoor Expedition"
    className="admin-brand-logo"
  />
</NavLink>


          {/* NAVIGATION */}

          <nav className="admin-navigation">

            <span className="admin-navigation-label">
              MANAGEMENT
            </span>

            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="material-symbols-outlined">
                inventory_2
              </span>

              <span>Products</span>
            </NavLink>


            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="material-symbols-outlined">
                group
              </span>

              <span>Users</span>
            </NavLink>


            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="material-symbols-outlined">
                receipt_long
              </span>

              <span>Orders</span>
            </NavLink>

          </nav>

        </div>


        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <NavLink
            to="/"
            className="admin-sidebar-action"
          >
            <span className="material-symbols-outlined">
              arrow_back
            </span>

            <span>Back to Store</span>
          </NavLink>


          <button
            type="button"
            className="admin-sidebar-action admin-logout"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =========================================
          ADMIN MAIN
      ========================================= */}

      <div className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div className="admin-header-left">

            <span className="admin-header-eyebrow">
              NOMAD / ADMIN
            </span>

            <h1>
              Management Portal
            </h1>

          </div>


          <div className="admin-header-right">

            <div className="admin-user">

              <div className="admin-user-avatar">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <div className="admin-user-details">

                <span className="admin-user-name">
                  {user?.name || "Admin"}
                </span>

                <span className="admin-user-role">
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;