import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createOrder,
  getOrdersByUser,
  updateOrder,
} from "../../services/orderService";

// =========================================================
// PLACE ORDER
// =========================================================

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const order = await createOrder(orderData);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================================================
// FETCH USER ORDERS
// =========================================================

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const orders = await getOrdersByUser(userId);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================================================
// CANCEL ORDER
// =========================================================

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const updatedOrder = await updateOrder(orderId, {
        status: "Cancelled",
      });

      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================================================
// SLICE
// =========================================================

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearOrderSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===================================================
      // PLACE ORDER
      // ===================================================

      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items.unshift(action.payload);
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ===================================================
      // FETCH ORDERS
      // ===================================================

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===================================================
      // CANCEL ORDER
      // ===================================================

      .addCase(cancelOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.error = null;

        const index = state.items.findIndex(
          (order) => order.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearOrderSuccess } = orderSlice.actions;

export default orderSlice.reducer;