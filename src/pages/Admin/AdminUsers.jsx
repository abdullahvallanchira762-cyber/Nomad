import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  changeUserStatus,
  fetchUsers,
} from "../../redux/slice/userSlice";

import "./AdminUsers.css";

function AdminUsers() {
  const dispatch = useDispatch();

  const {
    items: users,
    loading,
    error,
    mutationLoading,
  } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const currentUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (user) => {
    const newStatus =
      user.status === "blocked" ? "active" : "blocked";

    try {
      await dispatch(
        changeUserStatus({
          id: user.id,
          status: newStatus,
        })
      ).unwrap();

      toast.success(
        newStatus === "blocked"
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (error) {
      toast.error(error || "Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="admin-page-state">
        <span className="material-symbols-outlined">
          progress_activity
        </span>

        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-state admin-page-error">
        <span className="material-symbols-outlined">
          error
        </span>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="admin-users-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-section-label">
            USER MANAGEMENT
          </span>

          <h2>Users</h2>

          <p>
            Manage registered Nomad customers and account access.
          </p>
        </div>

        <div className="admin-user-count">
          <span>{users.length}</span>
          <small>REGISTERED USERS</small>
        </div>
      </div>

      <div className="admin-users-toolbar">
        <div className="admin-search-box">
          <span className="material-symbols-outlined">
            search
          </span>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search users..."
          />
        </div>
      </div>

      {currentUsers.length === 0 ? (
        <div className="admin-page-state">
          <span className="material-symbols-outlined">
            group
          </span>

          <p>
            {search
              ? "No users match your search."
              : "No users found."}
          </p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => {
                  const isAdmin = user.role === "admin";
                  const isBlocked = user.status === "blocked";

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-initial">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{user.name}</span>
                        </div>
                      </td>

                      <td className="admin-user-email">
                        {user.email}
                      </td>

                      <td>
                        <span className="admin-role">
                          {user.role || "user"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status ${
                            isBlocked
                              ? "admin-status-blocked"
                              : "admin-status-active"
                          }`}
                        >
                          <span className="admin-status-dot" />
                          {isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td>
                        {isAdmin ? (
                          <span className="admin-protected-label">
                            ADMIN
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={`admin-user-action ${
                              isBlocked
                                ? "admin-user-action-unblock"
                                : "admin-user-action-block"
                            }`}
                            onClick={() =>
                              handleStatusChange(user)
                            }
                            disabled={mutationLoading}
                          >
                            <span className="material-symbols-outlined">
                              {isBlocked
                                ? "lock_open"
                                : "block"}
                            </span>

                            {isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                type="button"
                onClick={() =>
                  setPage((current) => current - 1)
                }
                disabled={page === 1}
              >
                <span className="material-symbols-outlined">
                  chevron_left
                </span>
              </button>

              <span>
                PAGE {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => current + 1)
                }
                disabled={page === totalPages}
              >
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminUsers;