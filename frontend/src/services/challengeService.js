import api from "./api";

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const getChallenges = (params) => api.get("/challenges", { params });
export const getMyChallenges = () => api.get("/challenges/mine");
export const getChallengeById = (id) => api.get(`/challenges/${id}`);
export const createChallenge = (data) => api.post("/challenges", data);
export const updateChallenge = (id, data) => api.put(`/challenges/${id}`, data);
export const joinChallenge = (id) => api.post(`/challenges/${id}/join`);
