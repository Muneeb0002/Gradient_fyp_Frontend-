import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from '../chatHistory.api.js/getChatHistory.api.js';


const   useChatHistory = () => {
  return useQuery({
    queryKey: ["chat-search-history"],
    queryFn: getChatHistory,
    staleTime: 30 * 1000, 
    refetchInterval: 30 * 1000, 
    refetchOnWindowFocus: false,
  });
};

export default useChatHistory;


