import { useMutation } from "@tanstack/react-query";
import { submitEconomicsPaper } from "../economics.api.js/economicsPaper2A.api";

export const useSubmitEconomics = () => {
  return useMutation({
    mutationFn: submitEconomicsPaper,
    onSuccess: (data) => {
      console.log("Data successfully fetched from backend:", data);
      // Yahan aap success notification ya state update handle kar sakte hain
    },
    onError: (error) => {
      console.error("Mutation error occurred:", error.response?.data || error.message);
    },
  });
};