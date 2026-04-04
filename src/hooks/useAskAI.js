import { useMutation } from "@tanstack/react-query";
import { askAIFunction } from "../history.api.js/askAIFunction.js";

// Custom Hook
export const useAskAI = () => {
  return useMutation({
    mutationFn: askAIFunction,
    onSuccess: (data) => {
      console.log("AI Response Success--->>>>>>>>>>>>>>:", data);
    },
    onError: (error) => {
      // Jab koi error aaye
      console.log("AI Mutation Error:", error.response?.data || error.message);
    },
  });
};
