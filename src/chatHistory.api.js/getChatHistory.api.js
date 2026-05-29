import api from "../api/axios.api.js";

export const getChatHistory = async () => {
  const { data } = await api.get("/chat-search-history");
  return data;
};


