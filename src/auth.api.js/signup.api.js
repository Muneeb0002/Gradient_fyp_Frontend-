import api from "../api/axios.api.js";

export const signupUser = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data;
};