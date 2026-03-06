import { api } from "./api";

export const getTags = async () => {
  const res = await api.get("/tags");
  return res.data;
};

export const getTagById = async (id) => {
  const res = await api.get(`/tags/${id}`);
  return res.data;
};

export const createTag = async (data) => {
  const res = await api.post("/tags", data);
  return res.data;
};

export const updateTag = async (id, data) => {
  const res = await api.put(`/tags/${id}`, data);
  return res.data;
};

export const deleteTag = async (id) => {
  const res = await api.delete(`/tags/${id}`);
  return res.data;
};
