import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slice/productSlice";
import cartReducer from "./slice/cartSlice";
import authReducer from "./slice/authSlice";
import wishlistReducer from "./slice/wishlistSlice";
import orderReducer from "./slice/orderSlice";
import userReducer from "./slice/userSlice";
import adminAuthReducer from "./slice/adminAuthSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    user: userReducer,

    adminAuth: adminAuthReducer,
  },
});