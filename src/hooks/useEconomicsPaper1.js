import { useMutation } from "@tanstack/react-query";
import { economicsPaper1Request } from "../economics.api.js/economicsPaper1.api";

export const useEconomicsPaper1Mutation = () => {
  return useMutation({
    mutationFn: ({ mode, question, imageUri }) => {
      return economicsPaper1Request({
        query: mode === "image" ? undefined : question,
        image: mode === "text" ? undefined : imageUri,
      });
    },
  });
};