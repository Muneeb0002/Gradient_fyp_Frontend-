import { useMutation } from "@tanstack/react-query";
import { geographyAnalyzeImageQuestionApi } from "../geographyApi/geographyAnalyzeImageQuestionApi.js";

export const useGeographyAnalyzeImage = () => {
  return useMutation({
    mutationFn: (formData) => geographyAnalyzeImageQuestionApi(formData),
    
    onSuccess: (data) => {
      console.log("Success! Image analyzed:", data);
    },
    onError: (error) => {
      console.error("Mutation Error:", error.response?.data || error.message);
    },
  });
};