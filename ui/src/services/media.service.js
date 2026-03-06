import { api } from "./api";

export const getMedia = async () => {
  const res = await api.get("/media");
  return res.data;
};

export const getMediaById = async (id) => {
  const res = await api.get(`/media/${id}`);
  return res.data;
};

export const createMedia = async (data) => {
  const res = await api.post("/media", data);
  return res.data;
};

export const updateMedia = async (id, data) => {
  const res = await api.put(`/media/${id}`, data);
  return res.data;
};

export const deleteMedia = async (id) => {
  const res = await api.delete(`/media/${id}`);
  return res.data;
};
