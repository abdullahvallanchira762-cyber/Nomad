import { createSlice } from "@reduxjs/toolkit";

const getSavedAdmin = () => {
  try {
    const savedAdmin = localStorage.getItem("admin");

    if (!savedAdmin) return null;

    const parsedAdmin = JSON.parse(savedAdmin);

    if (
      parsedAdmin &&
      parsedAdmin.role === "admin" &&
      parsedAdmin.status === "active"
    ) {
      return parsedAdmin;
    }

    localStorage.removeItem("admin");
    return null;
  } catch {
    localStorage.removeItem("admin");
    return null;
  }
};

const savedAdmin = getSavedAdmin();

const initialState = {
  admin: savedAdmin,
  isAuthenticated: Boolean(savedAdmin),
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,

  reducers: {
    adminLoginSuccess: (state, action) => {
      const admin = action.payload;

      if (
        admin &&
        admin.role === "admin" &&
        admin.status === "active"
      ) {
        state.admin = admin;
        state.isAuthenticated = true;

        localStorage.setItem("admin", JSON.stringify(admin));
      } else {
        state.admin = null;
        state.isAuthenticated = false;

        localStorage.removeItem("admin");
      }
    },

    adminLogout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;

      localStorage.removeItem("admin");
    },
  },
});

export const {
  adminLoginSuccess,
  adminLogout,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;