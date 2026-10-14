
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

// Get admin challenges, with optional filters
export const getAdminChallenges = (params = {}) =>
  api.get("/admin/challenges", { params });

// Create a challenge
export const createAdminChallenge = (data) =>
  api.post("/admin/challenges", data);

// Update an existing challenge
export const updateAdminChallenge = (id, data) =>
  api.put(`/admin/challenges/${id}`, data);

// End a challenge early
export const endAdminChallenge = (id) =>
  api.patch(`/admin/challenges/${id}/end`);

// Delete a challenge
export const deleteAdminChallenge = (id) =>
  api.delete(`/admin/challenges/${id}`);