import api from "./api";

export const getLeaderboard = (params) => api.get("/leaderboards", { params });
export const getBadges = () => api.get("/badges");
