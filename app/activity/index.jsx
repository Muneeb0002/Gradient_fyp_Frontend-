import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ActivityScreenShell from "../../components/activity/ActivityScreenShell";
import ChatGptHeader from "../../components/activity/ChatGptHeader";
import ChatSidebarRow from "../../components/activity/ChatSidebarRow";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../components/activity/ActivityStateViews";
import Colors from "../../constants/Colors";
import {
  chatToSidebarItem,
  normalizeChats,
} from "../../lib/chatHistoryUtils";
import useChatHistory from "../../src/hooks/useChatHistory";

export default function RecentActivityScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useChatHistory();

  const chats = useMemo(() => normalizeChats(data), [data]);
  const items = useMemo(() => chats.map(chatToSidebarItem), [chats]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q),
    );
  }, [items, search]);

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
        title="Chats"
        subtitle={
          chats.length > 0
            ? `${chats.length} conversation${chats.length === 1 ? "" : "s"}`
            : undefined
        }
      />

      {isLoading ? (
        <ActivityLoading message="Loading chats…" />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Please check your connection."}
          onRetry={refetch}
        />
      ) : (
        <>
          <View style={styles.searchWrap}>
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={Colors.textMuted}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search chats"
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
            />
          </View>

          {filtered.length === 0 ? (
            <ActivityEmpty
              icon="message-text-outline"
              title={search ? "No chats found" : "No chats yet"}
              subtitle={
                search
                  ? "Try another keyword."
                  : "Your questions and AI answers will appear here."
              }
            />
          ) : (
            <View style={styles.list}>
              {filtered.map((item, idx) => (
                <ChatSidebarRow
                  key={item.id}
                  item={item}
                  isLast={idx === filtered.length - 1}
                  onPress={() =>
                    router.push({
                      pathname: "/activity/chat/[chatId]",
                      params: { chatId: item.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </>
      )}
    </ActivityScreenShell>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    paddingVertical: 11,
  },
  list: {
    marginTop: 4,
  },
});
