import { useMutation } from "@tanstack/react-query";
import { geographyTheoryDataApi } from "../geographyApi/geographyTheoryDataApi.js";

export const useGeographyTheoryData = () => {
  return useMutation({
    mutationFn: (formData) => geographyTheoryDataApi(formData),

    onSuccess: (res) => {
      console.log("Geography Theory Success:", res);
    },
    onError: (error) => {
      console.error("Geography Theory Error:", error.response?.data || error.message);
    },
  });
};