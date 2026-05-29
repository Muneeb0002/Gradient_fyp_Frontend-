import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { uploadGraphImage } from "../maths.api.js/mathsUploadGraphImage";


export const useGraphAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileObject) => uploadGraphImage(fileObject),
    
    onSuccess: (data) => {
      console.log("Graph Analysis Successful:", data);
      
      // Agar baad mein dashboard ke totalCount ko automatically update karwana ho:
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
    
    onError: (error) => {
      console.error("Mutation Main Error:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Graph analyze nahi ho saka.";
        
      Alert.alert("Upload Failed", errorMessage);
    },
  });
};

export default useGraphAnalysis;