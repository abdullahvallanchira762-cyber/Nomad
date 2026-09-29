import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const registerUser = async (userData) => {
  const newUser = {
    ...userData,
    role: "user",
    status: "active",
  };

  const response = await api.post("/users", newUser);

  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.get(
    `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );

  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  return response.data[0];
};