// useUploadGeography.js
import { useMutation } from "@tanstack/react-query";
import { uploadGeographyData } from "../geographyApi/uploadGeographyData.js";

export const useUploadGeography = () => {
  return useMutation({
    mutationFn: (formData) => uploadGeographyData(formData),

    onSuccess: (res) => {
      console.log("Upload Success:", res);
    },
    onError: (error) => {
      console.error("Upload Error:", error.response?.data || error.message);
    },
  });
};