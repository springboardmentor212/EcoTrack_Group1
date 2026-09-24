import api from "./api";

export const search = (params) => api.get("/search", { params });
