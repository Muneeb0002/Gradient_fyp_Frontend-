import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import ActivityScreenShell from "../../components/activity/ActivityScreenShell";
import ChatGptHeader from "../../components/activity/ChatGptHeader";
import ChatSidebarRow from "../../components/activity/ChatSidebarRow";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../components/activity/ActivityStateViews";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";
import {
  chatToSidebarItem,
  decodeTopicKey,
  getChatsForTopic,
  normalizeChats,
} from "../../lib/chatHistoryUtils";
import useChatHistory from "../../src/hooks/useChatHistory";

/** Same question — multiple sessions (ChatGPT-style thread list) */
export default function ActivitySessionsScreen() {
  const router = useRouter();
  const { activityId } = useLocalSearchParams();
  const id = Array.isArray(activityId) ? activityId[0] : activityId;
  const topicQuery = decodeTopicKey(id);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useChatHistory();

  const chats = useMemo(() => normalizeChats(data), [data]);
  const sessions = useMemo(
    () => getChatsForTopic(chats, topicQuery),
    [chats, topicQuery],
  );
  const items = useMemo(() => sessions.map(chatToSidebarItem), [sessions]);

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
      <ChatGptHeader
        onBack={() => router.back()}
        title="Thread"
        subtitle={`${sessions.length} version${sessions.length === 1 ? "" : "s"}`}
      />

      {isLoading ? (
        <ActivityLoading
          message="Loading thread"
          subtitle="Fetching sessions for this topic…"
        />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Could not load chats."}
          onRetry={refetch}
        />
      ) : !topicQuery || sessions.length === 0 ? (
        <ActivityEmpty
          title="Nothing here"
          subtitle="This thread could not be found."
          icon="alert-circle-outline"
        />
      ) : (
        <>
          <View style={styles.topicBox}>
            <Text style={styles.topicText}>
              {sanitizeDisplayText(topicQuery)}
            </Text>
          </View>
          <View style={styles.list}>
            {items.map((item, idx) => (
              <ChatSidebarRow
                key={item.id}
                item={{
                  ...item,
                  title: `Version ${sessions.length - idx}`,
                  preview: item.preview,
                }}
                isLast={idx === items.length - 1}
                onPress={() =>
                  router.push({
                    pathname: "/activity/chat/[chatId]",
                    params: { chatId: item.id },
                  })
                }
              />
            ))}
          </View>
        </>
      )}
    </ActivityScreenShell>
  );
}

const styles = StyleSheet.create({
  topicBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  topicText: {
    color: Colors.accent,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  list: { marginTop: 4 },
});
