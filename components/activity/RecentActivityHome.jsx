import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "../../constants/Colors";
// Sahi named import yahan lagaya hai
import { chatToSidebarItem, normalizeChats } from "../../lib/chatHistoryUtils";
import useChatHistory from "../../src/hooks/useChatHistory.js";

import ChatSidebarRow from "./ChatSidebarRow";


export default function RecentActivityHome() {
  const router = useRouter();
  const { data, isLoading, isError } = useChatHistory();

  const chats = normalizeChats(data);
  const items = chats.slice(0, 3).map(chatToSidebarItem);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  }

  if (isError || items.length === 0) {
    return (
      <Pressable
        onPress={() => router.push("/activity")}
        style={({ pressed }) => [styles.emptyCard, pressed && { opacity: 0.9 }]}
      >
        <MaterialCommunityIcons
          name="message-text-outline"
          size={26}
          color={Colors.textMuted}
        />
        <Text style={styles.emptyText}>
          {isError ? "Tap to open chats" : "No chats yet — ask a question"}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      {items.map((item, idx) => (
        <ChatSidebarRow
          key={item.id}
          item={item}
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  loading: { padding: 24, alignItems: "center" },
  emptyCard: {
    borderRadius: 16,
    padding: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});