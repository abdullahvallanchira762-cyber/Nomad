import api from "./api";

// =========================================================
// CREATE ORDER
// =========================================================

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

// =========================================================
// GET ORDERS BY USER
// =========================================================

export const getOrdersByUser = async (userId) => {
  const response = await api.get(`/orders?userId=${userId}`);

  return response.data;
};

// =========================================================
// UPDATE ORDER
// =========================================================

export const updateOrder = async (orderId, updateData) => {
  const response = await api.patch(
    `/orders/${orderId}`,
    updateData
  );

  return response.data;
};