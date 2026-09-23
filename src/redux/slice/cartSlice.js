import { createSlice } from "@reduxjs/toolkit";
import { getUserStorageKey } from "../../utils/userStorage";

const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

const getStoredCart = (userId) => {
  const key = getUserStorageKey("nomad_cart", userId);

  if (!key) return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getStoredCart(currentUser?.id),
    userId: currentUser?.id || null,
  },

  reducers: {
    setCartUser: (state, action) => {
      const userId = action.payload;

      state.userId = userId || null;
      state.items = getStoredCart(userId);
    },

    addToCart: (state, action) => {
      if (!state.userId) return;

      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return;
      }

      const requestedQuantity = action.payload.quantity || 1;

      state.items.push({
        ...action.payload,
        quantity: Math.min(
          requestedQuantity,
          action.payload.stock
        ),
      });

      const key = getUserStorageKey(
        "nomad_cart",
        state.userId
      );

      localStorage.setItem(
        key,
        JSON.stringify(state.items)
      );
    },

    removeFromCart: (state, action) => {
      if (!state.userId) return;

      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      const key = getUserStorageKey(
        "nomad_cart",
        state.userId
      );

      localStorage.setItem(
        key,
        JSON.stringify(state.items)
      );
    },

    updateQuantity: (state, action) => {
      if (!state.userId) return;

      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item && action.payload.quantity > 0) {
        item.quantity = Math.min(
          action.payload.quantity,
          item.stock
        );

        const key = getUserStorageKey(
          "nomad_cart",
          state.userId
        );

        localStorage.setItem(
          key,
          JSON.stringify(state.items)
        );
      }
    },

    clearCart: (state) => {
      if (!state.userId) {
        state.items = [];
        return;
      }

      const key = getUserStorageKey(
        "nomad_cart",
        state.userId
      );

      state.items = [];

      localStorage.removeItem(key);
    },
  },
});

export const {
  setCartUser,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;