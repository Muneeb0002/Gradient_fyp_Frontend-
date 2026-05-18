import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { RefreshControl } from "react-native";
import ActivityScreenShell from "../../../components/activity/ActivityScreenShell";
import ChatDetailContent from "../../../components/activity/ChatDetailContent";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../../components/activity/ActivityStateViews";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import Colors from "../../../constants/Colors";
import {
  findChatById,
  normalizeChats,
  truncate,
} from "../../../lib/chatHistoryUtils";
import useChatHistory from "../../../src/hooks/useChatHistory";

export default function ChatDetailScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const id = Array.isArray(chatId) ? chatId[0] : chatId;

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useChatHistory();

  const chats = useMemo(() => normalizeChats(data), [data]);
  const chat = useMemo(() => findChatById(chats, id), [chats, id]);

  return (
    <ActivityScreenShell
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={Colors.accent}
        />
      }
    >
      <ScreenHeader
        onBack={() => router.back()}
        title="Chat detail"
        subtitle={
          chat ? truncate(chat.query, 56) : "Review your question and AI answer"
        }
        icon="message-text-outline"
      />

      {isLoading ? (
        <ActivityLoading message="Loading chat…" />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Could not load this chat."}
          onRetry={refetch}
        />
      ) : !chat ? (
        <ActivityEmpty
          title="Chat not found"
          subtitle="It may have been deleted or is no longer available."
          icon="message-alert-outline"
        />
      ) : (
        <ChatDetailContent chat={chat} />
      )}
    </ActivityScreenShell>
  );
}
