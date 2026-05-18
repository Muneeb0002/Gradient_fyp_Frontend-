import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import useChatHistory from "../../src/hooks/useChatHistory";
import {
  getModeMeta,
  groupChatsByTopic,
  normalizeChats,
} from "../../lib/chatHistoryUtils";

export default function RecentActivityHome() {
  const router = useRouter();
  const { data, isLoading, isError } = useChatHistory();
  const chats = normalizeChats(data);
  const topics = groupChatsByTopic(chats).slice(0, 3);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  }

  if (isError || topics.length === 0) {
    return (
      <Pressable
        onPress={() => router.push("/activity")}
        style={styles.emptyCard}
      >
        <MaterialCommunityIcons
          name="message-text-outline"
          size={28}
          color={Colors.textMuted}
        />
        <Text style={styles.emptyText}>
          {isError ? "Could not load recent chats" : "No chats yet — start studying"}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      {topics.map((item, idx) => {
        const modeMeta = getModeMeta(item.mode);
        return (
          <Pressable
            key={item.id}
            onPress={() =>
              router.push({
                pathname: "/activity/[activityId]",
                params: { activityId: item.id },
              })
            }
            style={({ pressed }) => [
              styles.row,
              idx === topics.length - 1 && { marginBottom: 0 },
              pressed && { opacity: 0.88 },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: item.color || modeMeta.color }]} />
            <MaterialCommunityIcons
              name={item.icon || modeMeta.icon}
              size={20}
              color={Colors.textMuted}
              style={{ marginLeft: 12 }}
            />
            <View style={styles.textCol}>
              <Text style={styles.recentText} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.sub} numberOfLines={1}>
                {item.lastActive}
                {item.chatCount > 1 ? ` · ${item.chatCount} sessions` : ""}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dot: {
    width: 4,
    height: 28,
    borderRadius: 2,
    marginRight: 0,
  },
  textCol: { flex: 1, marginLeft: 10, marginRight: 8 },
  recentText: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  sub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  loading: { padding: 24, alignItems: "center" },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
