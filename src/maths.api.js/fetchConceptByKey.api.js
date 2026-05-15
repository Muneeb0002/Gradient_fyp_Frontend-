import api from "../api/axios.api.js";

export const fetchConceptByKey = async (conceptKey) => {
  if (!conceptKey) return null;
  
  const response = await api.get(`/maths_numerical/concepts/${conceptKey}`);
  return response.data;
};