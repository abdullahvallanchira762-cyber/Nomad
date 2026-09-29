import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUsers,
  updateUser,
} from "../../services/userService";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Block / Unblock user
export const changeUserStatus = createAsyncThunk(
  "users/changeUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateUser(id, { status });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  mutationLoading: false,
  error: null,
  mutationError: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH USERS
      // =========================
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // CHANGE USER STATUS
      // =========================
      .addCase(changeUserStatus.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })

      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.mutationLoading = false;

        const updatedUser = action.payload;

        const index = state.items.findIndex(
          (user) => user.id === updatedUser.id
        );

        if (index !== -1) {
          state.items[index] = updatedUser;
        }
      })

      .addCase(changeUserStatus.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;