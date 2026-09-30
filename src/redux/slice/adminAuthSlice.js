import { createSlice } from "@reduxjs/toolkit";

const savedAdmin = localStorage.getItem("admin");

const initialState = {
  admin: savedAdmin ? JSON.parse(savedAdmin) : null,
  isAuthenticated: !!savedAdmin,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,

  reducers: {
    adminLoginSuccess: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem("admin", JSON.stringify(action.payload));
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