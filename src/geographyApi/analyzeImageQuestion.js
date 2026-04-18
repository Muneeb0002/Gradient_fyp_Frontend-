
import api from "../api/axios.api.js";

// Image analysis function
export const analyzeImageQuestion = async (formData) => {
  const response = await api.post("/geography/Analyze_Image_Question", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

