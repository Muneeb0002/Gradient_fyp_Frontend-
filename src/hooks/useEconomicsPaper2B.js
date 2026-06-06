import { useMutation } from "@tanstack/react-query";
import { submitEconomicsPaper2 } from "../economics.api.js/economicsPaper2B.api";

export const useEconomicsPaper2 = () => {
  return useMutation({
    mutationFn: submitEconomicsPaper2,
  });
};