const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

const qs = (params = {}) => {
  const s = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== "" && v !== null,
    ),
  ).toString();
  return s ? `?${s}` : "";
};

export const api = {
  getRecommendations: () => request("/recommendations"),
  acceptRecommendation: (id) =>
    request(`/recommendations/${id}/accept`, { method: "POST" }),
  dismissRecommendation: (id) =>
    request(`/recommendations/${id}/dismiss`, { method: "POST" }),

  getNotifications: (params) => request(`/notifications${qs(params)}`),
  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () =>
    request("/notifications/read-all", { method: "PATCH" }),

  getLeaderboard: (params) => request(`/leaderboards${qs(params)}`),
  getGamificationProfile: () => request("/gamification/profile"),
  getBadges: () => request("/badges"),

  listChallenges: (params) => request(`/challenges${qs(params)}`),
  getChallenge: (id) => request(`/challenges/${id}`),
  joinChallenge: (id) => request(`/challenges/${id}/join`, { method: "POST" }),
  refreshChallengeProgress: (id) => request(`/challenges/${id}/progress`),
};
