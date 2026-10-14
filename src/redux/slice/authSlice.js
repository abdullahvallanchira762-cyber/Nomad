import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const user = action.payload;

      // A normal user login must clear any previous admin session.
      if (user?.role !== "admin") {
        localStorage.removeItem("admin");
      }

      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;