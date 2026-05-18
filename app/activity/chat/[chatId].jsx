import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import ActivityScreenShell from "../../../components/activity/ActivityScreenShell";
import ChatConversation from "../../../components/activity/ChatConversation";
import ChatGptHeader from "../../../components/activity/ChatGptHeader";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../../components/activity/ActivityStateViews";
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

  const { data, isLoading, isError, error, refetch } = useChatHistory();

  const chats = useMemo(() => normalizeChats(data), [data]);
  const chat = useMemo(() => findChatById(chats, id), [chats, id]);

  return (
    <ActivityScreenShell scroll={false} contentStyle={styles.shell}>
      <ChatGptHeader
        onBack={() => router.back()}
        title={chat ? truncate(chat.query, 36) : "Chat"}
        subtitle={chat?.marks != null ? `${chat.marks} marks` : undefined}
        accentTitle
      />

      {isLoading ? (
        <ActivityLoading message="Opening chat…" />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Could not load this chat."}
          onRetry={refetch}
        />
      ) : !chat ? (
        <ActivityEmpty
          title="Chat not found"
          subtitle="This conversation is no longer available."
          icon="message-alert-outline"
        />
      ) : (
        <View style={styles.conversation}>
          <ChatConversation chat={chat} />
        </View>
      )}
    </ActivityScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    paddingBottom: 16,
  },
  conversation: {
    flex: 1,
  },
});
