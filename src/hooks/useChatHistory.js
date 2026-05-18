import { useQuery } from "@tanstack/react-query";
import { MOCK_CHAT_HISTORY } from "../../constants/mockChatHistory";

/** Local mock only — swap queryFn with real fetch when backend is ready */
export default function useChatHistory() {
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => MOCK_CHAT_HISTORY,
    staleTime: Infinity,
  });
}
