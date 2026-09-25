import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async (updates) => {
  const res = await api.put("/profile", updates);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/profile");
  return res.data;
};
