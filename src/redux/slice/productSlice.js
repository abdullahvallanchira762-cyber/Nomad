import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";


/* =========================================================
   FETCH ALL PRODUCTS
========================================================= */

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


/* =========================================================
   FETCH SINGLE PRODUCT
========================================================= */

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


/* =========================================================
   CREATE PRODUCT
========================================================= */

export const addProduct = createAsyncThunk(
  "products/addProduct",

  async (productData, { rejectWithValue }) => {
    try {
      return await createProduct(productData);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to create product"
      );
    }
  }
);


/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const editProduct = createAsyncThunk(
  "products/editProduct",

  async (
    { id, productData },
    { rejectWithValue }
  ) => {
    try {
      return await updateProduct(
        id,
        productData
      );
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to update product"
      );
    }
  }
);


/* =========================================================
   DELETE PRODUCT
========================================================= */

export const removeProduct = createAsyncThunk(
  "products/removeProduct",

  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);

      return id;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to delete product"
      );
    }
  }
);


/* =========================================================
   SLICE
========================================================= */

const productSlice = createSlice({
  name: "products",

  initialState: {
    items: [],

    selectedProduct: null,

    loading: false,
    detailsLoading: false,

    mutationLoading: false,

    error: null,
    detailsError: null,
    mutationError: null,

    filters: {
      category: "All",
      search: "",
      sort: "default",
    },
  },

  reducers: {

    setCategory: (state, action) => {
      state.filters.category =
        action.payload;
    },

    setSearch: (state, action) => {
      state.filters.search =
        action.payload;
    },

    setSort: (state, action) => {
      state.filters.sort =
        action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailsError = null;
    },

    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },

  extraReducers: (builder) => {

    builder

      /* =====================================================
         FETCH PRODUCTS
      ===================================================== */

      .addCase(
        fetchProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )


      /* =====================================================
         FETCH PRODUCT
      ===================================================== */

      .addCase(
        fetchProductById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
          state.selectedProduct = null;
        }
      )

      .addCase(
        fetchProductById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedProduct =
            action.payload;
        }
      )

      .addCase(
        fetchProductById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload;
        }
      )


      /* =====================================================
         ADD PRODUCT
      ===================================================== */

      .addCase(
        addProduct.pending,
        (state) => {
          state.mutationLoading = true;
          state.mutationError = null;
        }
      )

      .addCase(
        addProduct.fulfilled,
        (state, action) => {
          state.mutationLoading = false;

          state.items.push(
            action.payload
          );
        }
      )

      .addCase(
        addProduct.rejected,
        (state, action) => {
          state.mutationLoading = false;
          state.mutationError =
            action.payload;
        }
      )


      /* =====================================================
         EDIT PRODUCT
      ===================================================== */

      .addCase(
        editProduct.pending,
        (state) => {
          state.mutationLoading = true;
          state.mutationError = null;
        }
      )

      .addCase(
        editProduct.fulfilled,
        (state, action) => {
          state.mutationLoading = false;

          const index =
            state.items.findIndex(
              (product) =>
                product.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }

          if (
            state.selectedProduct?.id ===
            action.payload.id
          ) {
            state.selectedProduct =
              action.payload;
          }
        }
      )

      .addCase(
        editProduct.rejected,
        (state, action) => {
          state.mutationLoading = false;
          state.mutationError =
            action.payload;
        }
      )


      /* =====================================================
         DELETE PRODUCT
      ===================================================== */

      .addCase(
        removeProduct.pending,
        (state) => {
          state.mutationLoading = true;
          state.mutationError = null;
        }
      )

      .addCase(
        removeProduct.fulfilled,
        (state, action) => {
          state.mutationLoading = false;

          state.items =
            state.items.filter(
              (product) =>
                product.id !==
                action.payload
            );

          if (
            state.selectedProduct?.id ===
            action.payload
          ) {
            state.selectedProduct = null;
          }
        }
      )

      .addCase(
        removeProduct.rejected,
        (state, action) => {
          state.mutationLoading = false;
          state.mutationError =
            action.payload;
        }
      );
  },
});


export const {
  setCategory,
  setSearch,
  setSort,
  clearSelectedProduct,
  clearMutationError,
} = productSlice.actions;


export default productSlice.reducer;