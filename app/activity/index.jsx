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
import ActivityListRow from "../../components/activity/ActivityListRow";
import ActivityScreenShell from "../../components/activity/ActivityScreenShell";
import ActivityStatsBar from "../../components/activity/ActivityStatsBar";
import {
  ActivityEmpty,
  ActivityError,
  ActivityLoading,
} from "../../components/activity/ActivityStateViews";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";
import {
  groupChatsByTopic,
  normalizeChats,
} from "../../lib/chatHistoryUtils";
import useChatHistory from "../../src/hooks/useChatHistory";

export default function RecentActivityScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useChatHistory();

  const chats = useMemo(() => normalizeChats(data), [data]);
  const topics = useMemo(() => groupChatsByTopic(chats), [chats]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.preview || "").toLowerCase().includes(q),
    );
  }, [topics, search]);

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
        title="Recent chats"
        subtitle="Your study sessions grouped by question."
        icon="history"
      />

      {isLoading ? (
        <ActivityLoading />
      ) : isError ? (
        <ActivityError
          message={error?.message || "Please check your connection."}
          onRetry={refetch}
        />
      ) : (
        <>
          <ActivityStatsBar count={data?.count ?? chats.length} topics={topics.length} />

          <View style={styles.searchWrap}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={Colors.textMuted}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search questions…"
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
            />
          </View>

          {filtered.length === 0 ? (
            <ActivityEmpty
              icon="message-text-outline"
              title={search ? "No matches" : "No chats yet"}
              subtitle={
                search
                  ? "Try a different search term."
                  : "Ask a question in any subject to build your history."
              }
            />
          ) : (
            <View style={styles.list}>
              {filtered.map((item) => (
                <ActivityListRow
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: "/activity/[activityId]",
                      params: { activityId: item.id },
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    paddingVertical: 14,
    fontWeight: "500",
  },
  list: { gap: 0 },
});
