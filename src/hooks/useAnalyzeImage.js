import { useMutation } from "@tanstack/react-query";
import { analyzeImageQuestion } from "../geographyApi/analyzeImageQuestion.js";
export const useAnalyzeImage = () => {
  return useMutation({
    mutationFn: (formData) => analyzeImageQuestion(formData),
    
    onSuccess: (data) => {
      console.log("Success! Image analyzed:", data);
    },
    onError: (error) => {
      console.error("Mutation Error:", error.response?.data || error.message);
    },
  });
};