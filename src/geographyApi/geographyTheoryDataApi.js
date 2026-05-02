import api from "../api/axios.api.js";


export const geographyTheoryDataApi = async (payload) => {
  // Postman ke mutabiq direct object jayega
  const response = await api.post("geography/geography_theory", payload); 
  return response.data;
};