import api from "./api";

// Get admin dashboard user statistics
export const getUserStats = () => api.get("/admin/users/stats");

// Get users, with optional role, status, and search filters
export const getUsers = (params = {}) =>
  api.get("/admin/users", { params });

// Get details for one user
export const getUserDetail = (id) =>
  api.get(`/admin/users/${id}`);

// Change a user's role
export const updateUserRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, { role });

// Suspend or reactivate a user
export const updateUserStatus = (id, status) =>
  api.patch(`/admin/users/${id}/status`, { status });