import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// --- Auth ---
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.put("/users/me", data),
  changePassword: (data) => api.put("/users/change-password", data),
};

// --- Products ---
export const productAPI = {
  getAll: () => api.get("/products/"),
  create: (data) => api.post("/products/", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// --- Categories ---
export const categoryAPI = {
  getAll: () => api.get("/categories/"),
  create: (data) => api.post("/categories/", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// --- Cart ---
export const cartAPI = {
  get: () => api.get("/cart/"),
  add: (data) => api.post("/cart/items", data), // ✔️ FIX
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
};

// --- Orders ---
export const orderAPI = {
  create: (data) => api.post("/orders/", data),
  getMyOrders: () => api.get("/orders/"),
};

// --- Admin Users ---
export const adminAPI = {
  getAllUsers: () => api.get("/users/admin/users"),
  deleteUser: (id) => api.delete(`/users/admin/users/${id}`),
};

export default api;
