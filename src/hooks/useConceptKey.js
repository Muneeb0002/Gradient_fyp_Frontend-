import { useQuery } from "@tanstack/react-query";
import { fetchConceptByKey } from "../maths.api.js/fetchConceptByKey.api.js";

export const useConcept = (conceptKey) => {
  return useQuery({
    queryKey: ["concept", conceptKey], 
    
    queryFn: () => fetchConceptByKey(conceptKey),
    
    enabled: !!conceptKey, 
    
    staleTime: 1000 * 60 * 5,
  });
};