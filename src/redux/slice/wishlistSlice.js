import { createSlice } from "@reduxjs/toolkit";
import { getUserStorageKey } from "../../utils/userStorage";

const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

const getStoredWishlist = (userId) => {
  const key = getUserStorageKey(
    "nomad_wishlist",
    userId
  );

  if (!key) return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: getStoredWishlist(currentUser?.id),
    userId: currentUser?.id || null,
  },

  reducers: {
    setWishlistUser: (state, action) => {
      const userId = action.payload;

      state.userId = userId || null;
      state.items = getStoredWishlist(userId);
    },

    addToWishlist: (state, action) => {
      if (!state.userId) return;

      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }

      const key = getUserStorageKey(
        "nomad_wishlist",
        state.userId
      );

      localStorage.setItem(
        key,
        JSON.stringify(state.items)
      );
    },

    removeFromWishlist: (state, action) => {
      if (!state.userId) return;

      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      const key = getUserStorageKey(
        "nomad_wishlist",
        state.userId
      );

      localStorage.setItem(
        key,
        JSON.stringify(state.items)
      );
    },

    toggleWishlist: (state, action) => {
      if (!state.userId) return;

      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.items.push(action.payload);
      }

      const key = getUserStorageKey(
        "nomad_wishlist",
        state.userId
      );

      localStorage.setItem(
        key,
        JSON.stringify(state.items)
      );
    },

    clearWishlist: (state) => {
      if (!state.userId) {
        state.items = [];
        return;
      }

      const key = getUserStorageKey(
        "nomad_wishlist",
        state.userId
      );

      state.items = [];

      localStorage.removeItem(key);
    },
  },
});

export const {
  setWishlistUser,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;