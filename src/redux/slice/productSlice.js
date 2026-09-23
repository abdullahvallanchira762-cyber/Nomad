import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProducts,
  getProductById,
} from "../../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    detailsLoading: false,
    error: null,
    detailsError: null,

    filters: {
      category: "All",
      search: "",
      sort: "default",
    },
  },

  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },

    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },

    setSort: (state, action) => {
      state.filters.sort = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single product
      .addCase(fetchProductById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      });
  },
});

export const {
  setCategory,
  setSearch,
  setSort,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;