const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const productsApi = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

export const categoriesApi = {
  getAll: () => request("/categories"),
  create: (data) => request("/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/orders/${id}`),
  create: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/orders/${id}`, { method: "DELETE" }),
  getStats: () => request("/dashboard/stats"),
};

export const usersApi = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/users/${id}`),
  create: (data) => request("/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/users/${id}`, { method: "DELETE" }),
  sync: (data) => request("/users/sync", { method: "POST", body: JSON.stringify(data) }),
};

export const settingsApi = {
  get: () => request("/settings"),
  update: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),
};

export const uploadApi = {
  images: (images) => request("/upload", { method: "POST", body: JSON.stringify({ images }) }),
};

export const reviewsApi = {
  getByProduct: (productId) => request(`/reviews/product/${productId}`),
  create: (data) => request("/reviews", { method: "POST", body: JSON.stringify(data) }),
  delete: (reviewId) => request(`/reviews/${reviewId}`, { method: "DELETE" }),
};
