import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import ActivityScreenShell from "../../components/activity/ActivityScreenShell";
import ChatSessionRow from "../../components/activity/ChatSessionRow";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../components/activity/ActivityStateViews";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";
import {
  chatToSessionRow,
  decodeTopicKey,
  getChatsForTopic,
  getModeMeta,
  normalizeChats,
} from "../../lib/chatHistoryUtils";
import useChatHistory from "../../src/hooks/useChatHistory";

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
  const modeMeta = getModeMeta(sessions[0]?.mode);

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
        title="Chat sessions"
        subtitle={`${sessions.length} conversation${sessions.length === 1 ? "" : "s"}`}
        icon="message-text-clock-outline"
      />

      {isLoading ? (
        <ActivityLoading message="Loading sessions…" />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Could not load chats."}
          onRetry={refetch}
        />
      ) : !topicQuery || sessions.length === 0 ? (
        <ActivityEmpty
          title="No sessions found"
          subtitle="This topic may have been removed or the link is invalid."
          icon="alert-circle-outline"
        />
      ) : (
        <>
          <LinearGradient
            colors={[`${modeMeta.color}28`, "rgba(255,255,255,0.03)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topicCard}
          >
            <Text style={styles.topicLabel}>Question</Text>
            <Text style={styles.topicText}>{sanitizeDisplayText(topicQuery)}</Text>
          </LinearGradient>

          <Text style={styles.sectionLabel}>All sessions</Text>

          <View style={styles.card}>
            {sessions.map((chat, idx) => (
              <View
                key={chat._id}
                style={idx === sessions.length - 1 ? styles.lastRow : undefined}
              >
                <ChatSessionRow
                  session={chatToSessionRow(chat)}
                  accentColor={modeMeta.color}
                  onPress={() =>
                    router.push({
                      pathname: "/activity/chat/[chatId]",
                      params: { chatId: chat._id },
                    })
                  }
                />
              </View>
            ))}
          </View>
        </>
      )}
    </ActivityScreenShell>
  );
}

const styles = StyleSheet.create({
  topicCard: {
    marginBottom: 22,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  topicLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  topicText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  lastRow: { borderBottomWidth: 0 },
});
