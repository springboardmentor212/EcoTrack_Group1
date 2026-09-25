import api from "./api";

export const createCarbonEntry = (payload) => api.post("/carbon", payload);

export const getCarbonEntries = (page = 1, limit = 10) =>
  api.get("/carbon", { params: { page, limit } });

export const searchCarbonEntries = ({ q, category, from, to } = {}) =>
  api.get("/carbon/search", { params: { q, category, from, to } });

export const updateCarbonEntry = (id, payload) =>
  api.put(`/carbon/${id}`, payload);

export const getCarbonEntry = (id) => api.get(`/carbon/${id}`);

export const deleteCarbonEntry = (id) => api.delete(`/carbon/${id}`);
