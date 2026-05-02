
import { useMutation } from "@tanstack/react-query";
import { historyImageTheory } from "../historyImageTheoryApi/historyImageTheory.api.js";

const useHistoryImageTheory = () => {
  return useMutation({
    mutationFn: historyImageTheory,

    onSuccess: (response) => {
      console.log("History Image Theory Success:", response);
    },

    onError: (error) => {
      console.log("History Image Theory Error:", error);
    },
  });
};

export default useHistoryImageTheory;